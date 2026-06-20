const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"]
  }
});

// Database Setup
const dbPath = process.env.DB_PATH || path.join(__dirname, 'drain_u_play.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS payments (id TEXT PRIMARY KEY, player_id TEXT, amount REAL, status TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
  db.run("CREATE TABLE IF NOT EXISTS rooms (id TEXT PRIMARY KEY, goddess_id TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, solana_address TEXT, wishtender_link TEXT, throne_link TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, room_id TEXT, goddess_id TEXT, total_tribute REAL, ended_at DATETIME DEFAULT CURRENT_TIMESTAMP)");
});

const dbAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const DEFAULT_SOLANA_ADDRESS = 'GsxgBgtbCztWcbdFd6ThgGMseZeBwWjfEwMtKQ3jubgJ';
const DEFAULT_WISHTENDER_LINK = 'https://wishtender.com/goddess';
const DEFAULT_THRONE_LINK = 'https://throne.com/goddess';

// Game State
let rooms = {};

// Load rooms from DB on startup
const initRooms = async () => {
  try {
    const dbRooms = await dbAll("SELECT * FROM rooms");
    dbRooms.forEach(r => {
      rooms[r.id] = {
        goddessId: r.goddess_id,
        solanaAddress: r.solana_address || DEFAULT_SOLANA_ADDRESS,
        wishtenderLink: r.wishtender_link || DEFAULT_WISHTENDER_LINK,
        throneLink: r.throne_link || DEFAULT_THRONE_LINK,
        players: {},
        turn: null,
        history: []
      };
    });
    // Ensure main exists
    if (!rooms['main']) {
      rooms['main'] = { 
        goddessId: 'goddess_1', 
        solanaAddress: DEFAULT_SOLANA_ADDRESS,
        wishtenderLink: DEFAULT_WISHTENDER_LINK,
        throneLink: DEFAULT_THRONE_LINK,
        players: {}, 
        turn: null, 
        history: [] 
      };
    }
  } catch (error) {
    console.error('Failed to init rooms:', error);
  }
};
initRooms();

app.post('/create-room', async (req, res) => {
  const { roomId, goddessId } = req.body;
  if (!rooms[roomId]) {
    try {
      await dbRun("INSERT INTO rooms (id, goddess_id, solana_address, wishtender_link, throne_link) VALUES (?, ?, ?, ?, ?)", [roomId, goddessId, DEFAULT_SOLANA_ADDRESS, DEFAULT_WISHTENDER_LINK, DEFAULT_THRONE_LINK]);
      rooms[roomId] = {
        goddessId,
        solanaAddress: DEFAULT_SOLANA_ADDRESS,
        wishtenderLink: DEFAULT_WISHTENDER_LINK,
        throneLink: DEFAULT_THRONE_LINK,
        players: {},
        turn: null,
        history: []
      };
      res.json({ success: true, roomId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ error: 'Room already exists' });
  }
});

app.get('/rooms', (req, res) => {
  res.json(Object.keys(rooms).map(id => ({
    id,
    playerCount: Object.keys(rooms[id].players).length,
    goddessId: rooms[id].goddessId
  })));
});

app.get('/session-history', async (req, res) => {
  try {
    const history = await dbAll("SELECT * FROM sessions ORDER BY ended_at DESC LIMIT 20");
    res.json(history || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/create-checkout-session', async (req, res) => {
  const { playerId } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Drain U Play Entry Fee',
            },
            unit_amount: 444,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&playerId=${playerId}`,
      cancel_url: `${req.headers.origin}/payment-cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/verify-payment', async (req, res) => {
  const { session_id, playerId } = req.query;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === 'paid') {
      await dbRun("INSERT OR REPLACE INTO payments (id, player_id, amount, status) VALUES (?, ?, 6.66, 'paid')", [session_id, playerId]);
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/payment-status/:playerId', async (req, res) => {
  const { playerId } = req.params;
  try {
    const result = await dbAll("SELECT * FROM payments WHERE player_id = ? AND status = 'paid'", [playerId]);
    if (result && result.length > 0) {
      res.json({ paid: true });
    } else {
      res.json({ paid: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_game', (data) => {
    const { playerId, name, roomId = 'main' } = data;
    console.log(`Player ${playerId} joining room ${roomId}`);
    socket.join(roomId);
    
    if (!rooms[roomId]) {
      rooms[roomId] = { 
        goddessId: 'goddess_1', 
        solanaAddress: DEFAULT_SOLANA_ADDRESS,
        wishtenderLink: DEFAULT_WISHTENDER_LINK,
        throneLink: DEFAULT_THRONE_LINK,
        players: {}, 
        turn: null, 
        history: [] 
      };
    }

    const room = rooms[roomId];

    if (!room.players[playerId]) {
      room.players[playerId] = {
        id: playerId,
        name: name || playerId,
        pos: 0,
        balance: 1000,
        socketId: socket.id,
        lastTribute: 0,
        turnsTaken: 0,
        tributeHistory: [],
        nextDrainHalfPrice: false,
        nextTributeMultiplier: 1,
        tributeTrapTurns: 0,
        banTurns: 0,
        debtTracker: 1.0,
        loyaltyTokens: 0,
        firstDutyPaid: false,
        cryptoApprovalRequested: false
      };
    } else {
      room.players[playerId].socketId = socket.id;
    }

    if (!room.turn) room.turn = playerId;

    io.to(roomId).emit('state_update', room);
  });

  socket.on('confirm_first_duty', (data) => {
    const { playerId, roomId = 'main' } = data;
    const room = rooms[roomId];
    if (room && room.players[playerId]) {
      room.players[playerId].firstDutyPaid = true;
      room.players[playerId].cryptoApprovalRequested = false;
      room.history.unshift(`${room.players[playerId].name} settled their initial debt!`);
      io.to(roomId).emit('state_update', room);
    }
  });

  socket.on('request_crypto_approval', (data) => {
    const { playerId, roomId = 'main' } = data;
    const room = rooms[roomId];
    if (room && room.players[playerId]) {
      room.players[playerId].cryptoApprovalRequested = true;
      room.history.unshift(`${room.players[playerId].name} requested crypto payment approval.`);
      io.to(roomId).emit('state_update', room);
    }
  });

  socket.on('update_room_settings', async (data) => {
    const { roomId, solanaAddress, wishtenderLink, throneLink } = data;
    const room = rooms[roomId];
    if (room) {
      try {
        if (solanaAddress !== undefined) {
          room.solanaAddress = solanaAddress;
          await dbRun("UPDATE rooms SET solana_address = ? WHERE id = ?", [solanaAddress, roomId]);
        }
        if (wishtenderLink !== undefined) {
          room.wishtenderLink = wishtenderLink;
          await dbRun("UPDATE rooms SET wishtender_link = ? WHERE id = ?", [wishtenderLink, roomId]);
        }
        if (throneLink !== undefined) {
          room.throneLink = throneLink;
          await dbRun("UPDATE rooms SET throne_link = ? WHERE id = ?", [throneLink, roomId]);
        }
        io.to(roomId).emit('state_update', room);
      } catch (error) {
        console.error('Failed to update room settings:', error);
      }
    }
  });

  socket.on('roll_dice', (data) => {
    const { playerId, roomId = 'main' } = data;
    const room = rooms[roomId];
    if (!room || room.turn !== playerId) return;

    const player = room.players[playerId];
    
    // Debt Tracker increase if in debt at start of turn
    if (player.balance < 0) {
      player.debtTracker = (player.debtTracker || 1.0) + 0.05; // 5% increase per turn in debt
      room.history.unshift(`${player.name}'s debt is growing! Tracker now at ${player.debtTracker.toFixed(2)}x`);
    }

    // Handle ban turns
    if (player.banTurns > 0) {
      player.banTurns--;
      room.history.unshift(`${player.name} is trapped in the Waiting Room (${player.banTurns} turns left).`);
      
      const playerIds = Object.keys(room.players);
      const currentIndex = playerIds.indexOf(playerId);
      room.turn = playerIds[(currentIndex + 1) % playerIds.length];
      
      io.to(roomId).emit('state_update', room);
      return;
    }

    const roll = Math.floor(Math.random() * 6) + 1;
    player.turnsTaken = (player.turnsTaken || 0) + 1;
    const oldPos = player.pos;
    player.pos = (player.pos + roll) % 40;

    // Handle Tribute Trap
    if (player.tributeTrapTurns > 0) {
      player.tributeTrapTurns--;
    }

    // Check if passed START
    if (player.pos < oldPos) {
      player.balance -= 50; // Initiation Tax
      room.history.unshift(`${player.name} passed START and paid the $50 Initiation Tax!`);
    }

    room.history.unshift(`${player.name} rolled a ${roll} and landed on space ${player.pos}`);
    if (room.history.length > 20) room.history.pop();

    // Change turn
    const playerIds = Object.keys(room.players);
    const currentIndex = playerIds.indexOf(playerId);
    room.turn = playerIds[(currentIndex + 1) % playerIds.length];

    io.to(roomId).emit('state_update', room);
    io.to(roomId).emit('dice_rolled', { playerId, roll, newPos: player.pos });
  });

  socket.on('admin_move_player', (data) => {
    const { playerId, targetPos, roomId = 'main' } = data;
    const room = rooms[roomId];
    if (room && room.players[playerId]) {
      room.players[playerId].pos = targetPos;
      io.to(roomId).emit('state_update', room);
    }
  });

  socket.on('process_payment', (data) => {
    const { playerId, amount, roomId = 'main' } = data;
    const room = rooms[roomId];
    if (room && room.players[playerId]) {
      const player = room.players[playerId];
      
      let finalAmount = amount;
      
      // Loyalty Token: 25% discount on next payment (if it's substantial, e.g. > $50)
      if (player.loyaltyTokens > 0 && amount > 50) {
        finalAmount *= 0.75;
        player.loyaltyTokens--;
        room.history.unshift(`${player.name} used a Loyalty Token for a 25% discount!`);
      }

      // Debt Tracker: Multiplier if balance is negative
      if (player.balance < 0) {
        finalAmount *= (player.debtTracker || 1.0);
      }

      player.balance -= finalAmount;
      player.lastTribute = finalAmount;
      player.tributeHistory = [finalAmount, ...(player.tributeHistory || [])].slice(0, 10);
      room.history.unshift(`${player.name} paid a tribute of ${finalAmount.toFixed(2)}`);
      io.to(roomId).emit('state_update', room);
    }
  });

  socket.on('bribe_to_move', (data) => {
    const { playerId, roomId = 'main' } = data;
    const room = rooms[roomId];
    if (room && room.players[playerId] && room.turn === playerId) {
      const player = room.players[playerId];
      player.balance -= 75;
      player.banTurns = 0;
      room.history.unshift(`${player.name} paid $75 to bypass the ban!`);
      io.to(roomId).emit('state_update', room);
    }
  });

  socket.on('update_player_flags', (data) => {
    const { playerId, roomId = 'main', flags } = data;
    const room = rooms[roomId];
    if (room && room.players[playerId]) {
      room.players[playerId] = { ...room.players[playerId], ...flags };
      io.to(roomId).emit('state_update', room);
    }
  });

  socket.on('trigger_sync_task', (data) => {
    const { roomId = 'main', task } = data;
    const room = rooms[roomId];
    if (room) {
      room.history.unshift(`GODDESS TRIGGERED SYNC TASK: ${task}`);
      io.to(roomId).emit('sync_task_triggered', { task });
      io.to(roomId).emit('state_update', room);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    // We keep player data for persistence during session
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
