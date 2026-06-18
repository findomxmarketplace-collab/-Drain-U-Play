import { useEffect, useState, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import axios from 'axios'
import { Dice6, Wallet, History, Users, Video } from 'lucide-react'
import GameBoard from './components/GameBoard'
import AgeVerification from './components/AgeVerification'
import VideoChat from './components/VideoChat'
import GoddessDashboard from './components/GoddessDashboard'
import LuckCard from './components/LuckCard'
import TributeOverlay from './components/TributeOverlay'
import DrainOverlay from './components/DrainOverlay'
import GambleOverlay from './components/GambleOverlay'
import MandateOverlay from './components/MandateOverlay'
import FirstDutyOverlay from './components/FirstDutyOverlay'
import { BOARD_SPACES, LUCK_CARDS, getDependencyTier } from './gameData'
import BACKEND_URL from './api'

const socket = io(BACKEND_URL)

function LandingPage() {
  const [playerId] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlId = urlParams.get('playerId');
    if (urlId) return urlId;
    return localStorage.getItem('playerId') || 'sub_' + Math.random().toString(36).substr(2, 6);
  });
  const [isPaid, setIsPaid] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    localStorage.setItem('playerId', playerId)
    checkStatus()
  }, [playerId])

  const checkStatus = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/payment-status/${playerId}`)
      setIsPaid(res.data.paid)
      // For now, verification is session-based or mock
      const urlParams = new URLSearchParams(window.location.search);
      const isVerifiedParam = urlParams.get('isVerified') === 'true';
      const verified = sessionStorage.getItem('isVerified') === 'true' || isVerifiedParam
      setIsVerified(verified)
    } catch (err) {
      console.error('Failed to check status', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/create-checkout-session`, { playerId })
      window.location.href = res.data.url
    } catch (err) {
      alert('Payment failed: ' + err.message)
    }
  }

  if (loading) return <div className="min-h-screen bg-pink-100 flex items-center justify-center">Loading Goddess's realm...</div>

  if (!isVerified) {
    return <AgeVerification onVerified={() => {
      sessionStorage.setItem('isVerified', 'true')
      setIsVerified(true)
    }} />
  }

  if (!isPaid) {
    return (
      <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center p-4 text-center">
        <div className="absolute top-2 left-2 text-[10px] text-pink-300">ID: {playerId}</div>
        <img src="/logo.png" alt="Drain U Play Logo" className="w-48 mb-8" />
        <h1 className="text-5xl font-extrabold text-pink-600 mb-4 drop-shadow-sm">Drain U Play</h1>
        <p className="text-pink-500 font-bold mb-8 tracking-widest uppercase">The Ultimate Submission Game</p>
        <div className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-pink-300 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Mandatory Entry Tribute</h2>
          <p className="text-lg text-gray-600 mb-8">
            To enter and play, a one-time tribute of <span className="font-bold text-pink-500">$4.44</span> is required.
          </p>
          <button 
            onClick={handlePayment}
            className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition-all shadow-lg transform hover:scale-[1.02]"
          >
            Pay Tribute & Play
          </button>
        </div>
      </div>
    )
  }

  return <GameRoom playerId={playerId} />
}

function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const sessionId = searchParams.get('session_id')
  const playerId = searchParams.get('playerId')

  useEffect(() => {
    if (sessionId && playerId) {
      axios.get(`${BACKEND_URL}/verify-payment?session_id=${sessionId}&playerId=${playerId}`)
        .then(() => {
          setTimeout(() => navigate('/'), 2000)
        })
    }
  }, [sessionId, playerId, navigate])

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-green-300 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Tribute Accepted</h2>
        <p className="text-lg text-gray-600">Your devotion has been recognized. Entering the room...</p>
      </div>
    </div>
  )
}

function GameRoom({ playerId }) {
  const [searchParams] = useSearchParams()
  const roomId = searchParams.get('roomId') || 'main'
  const [state, setState] = useState(null)
  const stateRef = useRef(null)
  const [lastSpace, setLastSpace] = useState(null)
  const [showEvent, setShowEvent] = useState(false)
  const [eventData, setEventData] = useState(null)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    socket.emit('join_game', { playerId, roomId })
    
    socket.on('state_update', (newState) => {
      setState(newState)
      if (newState.players[playerId]) {
        const currentPos = newState.players[playerId].pos
        const space = BOARD_SPACES[currentPos]
        setLastSpace(space)
      }
    })

    socket.on('dice_rolled', (data) => {
      if (data.playerId === playerId) {
        const player = stateRef.current.players[playerId]
        const space = BOARD_SPACES[data.newPos]
        
        let finalEventData = { ...space }

        // Handle Tribute Trap
        if (player.tributeTrapTurns > 0) {
          finalEventData = {
            ...finalEventData,
            type: 'TRIBUTE',
            price: 25,
            label: 'TRIBUTE TRAP',
            description: "The Goddess has trapped you. Every space is a tribute."
          }
        }
        
        if (space.type === 'DRAIN_ZONE') {
          // Default to Level 1 price if levels exist
          const level = space.level || 1
          const price = space.levels ? space.levels[level - 1] : (space.price || 0)
          finalEventData.price = price
          finalEventData.type = 'TRIBUTE' // Use Tribute UI for most things
        }

        if (space.type === 'MAINTENANCE_DECREE' || space.type === 'RUINOUS_DEMAND' || space.type === 'GODDESS_LUCK') {
          const deck = space.type === 'GODDESS_LUCK' ? 'MAINTENANCE' : space.type.replace('_DECREE', '').replace('_DEMAND', '')
          const filteredCards = LUCK_CARDS.filter(c => c.deck === deck || !c.deck)
          const randomCard = filteredCards[Math.floor(Math.random() * filteredCards.length)]
          finalEventData = { ...finalEventData, ...randomCard, isLuckCard: true }
          
          // Custom logic for specific luck cards
          if (randomCard.id === 'r1') { // Wallet Rinse
            const balance = player.balance > 0 ? player.balance : 1000 // Mock balance if in debt
            const amount = Math.floor(balance * 0.1)
            finalEventData.price = amount
          } else if (randomCard.id === 'random_act') {
            const amount = Math.floor(Math.random() * (randomCard.max - randomCard.min + 1)) + randomCard.min
            finalEventData.price = amount
            finalEventData.description = `She wants a surprise. Send ${amount} now.`
          } else if (randomCard.id === 'shopping_trip') {
            const amount = data.roll * 10
            finalEventData.price = amount
            finalEventData.description = `She's at the mall. Tribute the amount of your last roll (${data.roll}) multiplied by 10: ${amount}`
          } else if (randomCard.id === 'tribute_streak') {
            const turns = player.turnsTaken || 0
            const amount = turns * 10
            finalEventData.price = amount
            finalEventData.description = `Send $10 for every turn you've taken so far (${turns} turns): ${amount}`
          } else if (randomCard.id === 'interest') {
            const lastTribute = player.lastTribute || 50
            const amount = Math.floor(lastTribute * 0.2)
            finalEventData.price = amount
            finalEventData.description = `You took too long to move. Pay a 20% interest fee on your last tribute (${lastTribute}): ${amount}`
          } else if (randomCard.id === 'late_fee') {
            // Find distance to player ahead
            const playerIds = Object.keys(stateRef.current.players)
            let maxDist = 0
            playerIds.forEach(id => {
               if (id !== playerId) {
                 const otherPos = stateRef.current.players[id].pos
                 const dist = (otherPos - data.newPos + 40) % 40
                 if (dist > maxDist) maxDist = dist
               }
            })
            const amount = maxDist * 5
            finalEventData.price = amount
            finalEventData.description = `You're moving too slowly. Pay $5 for every space between you and the furthest player (${maxDist} spaces): ${amount}`
          } else if (randomCard.id === 'devotion_check') {
            const history = player.tributeHistory || []
            const recentlyPaid = history.length > 0 // Simplified: check if any history
            const amount = recentlyPaid ? 20 : 100
            finalEventData.price = amount
            finalEventData.description = recentlyPaid ? "You've been obedient. Pay only $20." : "You haven't paid enough. Pay $100."
          }
        } else {
          // Handle Multipliers
          if (player.nextTributeMultiplier > 1 && finalEventData.price) {
            finalEventData.price *= player.nextTributeMultiplier
            finalEventData.description += ` (TRIPLED by Goddess!)`
          }

          // Handle Golden Ticket
          if (space.type === 'DRAIN' && player.nextDrainHalfPrice && finalEventData.price) {
            finalEventData.price /= 2
            finalEventData.description += ` (Half Price - Golden Ticket!)`
          }
        }

        // Check for double or nothing
        if (finalEventData.id === 'double_or_nothing') {
          finalEventData.type = 'GAMBLE'
        }

        // Small delay to allow piece to "move" visually
        setTimeout(() => {
          setEventData(finalEventData)
          setShowEvent(true)
          
          // Handle movement-based luck cards
          if (finalEventData.type === 'LUCK_MOVE') {
            let newTarget = 0
            if (finalEventData.move_to !== undefined) {
              newTarget = finalEventData.move_to
            } else {
              newTarget = (data.newPos + finalEventData.move) % 40
            }
            setTimeout(() => {
              socket.emit('admin_move_player', { playerId, targetPos: newTarget, roomId })
            }, 3000) 
          } else if (finalEventData.type === 'LUCK_MOVE_NEAREST') {
            let nearest = data.newPos
            for (let i = 1; i < 40; i++) {
              const checkPos = (data.newPos + i) % 40
              if (BOARD_SPACES[checkPos].type === finalEventData.target_type) {
                nearest = checkPos
                break
              }
            }
            setTimeout(() => {
              socket.emit('admin_move_player', { playerId, targetPos: nearest, roomId })
            }, 3000)
          }

          // Handle special flags from cards
          if (finalEventData.id === 'golden_ticket') {
             socket.emit('update_player_flags', { playerId, roomId, flags: { nextDrainHalfPrice: true } })
          } else if (finalEventData.id === 'double_dice') {
             socket.emit('update_player_flags', { playerId, roomId, flags: { nextTributeMultiplier: 3 } })
          } else if (finalEventData.id === 'tribute_trap') {
             socket.emit('update_player_flags', { playerId, roomId, flags: { tributeTrapTurns: 3 } })
          } else if (finalEventData.id === 'banned') {
             socket.emit('update_player_flags', { playerId, roomId, flags: { banTurns: 2 } })
          }

          // SERVICE SQUARE logic
          if (finalEventData.type === 'SERVICE') {
            socket.emit('update_player_flags', { 
              playerId, 
              roomId, 
              flags: { loyaltyTokens: (player.loyaltyTokens || 0) + 1 } 
            })
          }

          // BANKRUPTCY CHECK
          if (player.balance < -2000) {
            finalEventData.type = 'BANKRUPTCY'
            finalEventData.label = 'Insolvency Reached'
            finalEventData.description = "Your debt has exceeded your worth. You must negotiate 'Access' with the Goddess to continue, or forfeit everything."
          }

        }, 600)
      }
    })

    socket.on('sync_task_triggered', (data) => {
      setEventData({
        label: 'GLOBAL TASK',
        description: data.task,
        type: 'MANDATE'
      })
      setShowEvent(true)
    })

    return () => {
      socket.off('state_update')
      socket.off('dice_rolled')
      socket.off('sync_task_triggered')
    }
  }, [playerId, roomId])

  const handleRoll = () => {
    socket.emit('roll_dice', { playerId, roomId })
  }

  const handleBribe = () => {
    socket.emit('bribe_to_move', { playerId, roomId })
  }

  const closeEvent = () => {
    if (eventData && eventData.price > 0) {
      socket.emit('process_payment', { playerId, amount: eventData.price, roomId })
    }
    // Clear multiplier if it was used
    if (eventData && eventData.price > 0 && stateRef.current.players[playerId].nextTributeMultiplier > 1) {
       socket.emit('update_player_flags', { playerId, roomId, flags: { nextTributeMultiplier: 1 } })
    }
    // Clear golden ticket if used
    if (eventData && eventData.type === 'DRAIN' && stateRef.current.players[playerId].nextDrainHalfPrice) {
       socket.emit('update_player_flags', { playerId, roomId, flags: { nextDrainHalfPrice: false } })
    }

    setShowEvent(false)
  }

  const handleGambleResult = (amount) => {
    if (amount > 0) {
      socket.emit('process_payment', { playerId, amount, roomId })
    }
    setShowEvent(false)
  }

  if (!state) return <div className="min-h-screen bg-neutral-900 text-pink-400 flex items-center justify-center">Syncing with Goddess...</div>

  const currentPlayer = state.players[playerId]
  const isMyTurn = state.turn === playerId
  const isGoddess = playerId === state.goddessId

  const handleFirstDutyConfirm = () => {
    socket.emit('confirm_first_duty', { playerId, roomId })
  }

  const handleRequestCryptoApproval = () => {
    socket.emit('request_crypto_approval', { playerId, roomId })
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col lg:flex-row p-4 gap-6 relative overflow-hidden">
      {/* First Duty Logic */}
      {!isGoddess && currentPlayer && !currentPlayer.firstDutyPaid && (
        <>
          <div className="fixed top-0 left-0 right-0 z-[100] bg-pink-600 text-white py-3 px-4 text-center font-black uppercase tracking-widest animate-bounce">
            A Goddess never pays for Her own entertainment. Settle your debt immediately to unlock the board.
          </div>
          <FirstDutyOverlay 
            goddessName={state.goddessId} 
            solanaAddress={state.solanaAddress}
            throneLink={state.throneLink}
            wishtenderLink={state.wishtenderLink}
            onConfirm={handleFirstDutyConfirm} 
            onRequestCryptoApproval={handleRequestCryptoApproval}
            isPendingApproval={currentPlayer.cryptoApprovalRequested}
          />
        </>
      )}

      {/* Event Modal */}
      {showEvent && eventData && (
        <>
          {eventData.isLuckCard ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
              <LuckCard 
                title={eventData.label}
                description={eventData.description}
                onComplete={closeEvent}
              />
            </div>
          ) : (eventData.type === 'TRIBUTE' || eventData.type === 'TRANSFER' || eventData.type === 'TAX' || eventData.type === 'SUBSCRIPTION') ? (
            <TributeOverlay 
              label={eventData.label}
              description={eventData.description}
              price={eventData.price || 0}
              onComplete={closeEvent}
              paymentLink={state.throneLink || state.wishtenderLink}
            />
          ) : eventData.type === 'DRAIN' ? (
            <DrainOverlay 
              label={eventData.label}
              description={eventData.description}
              price={eventData.price || 0}
              onComplete={closeEvent}
              paymentLink={state.throneLink || state.wishtenderLink}
            />
          ) : eventData.type === 'GAMBLE' ? (
            <GambleOverlay 
              onResult={handleGambleResult}
            />
          ) : eventData.type === 'MANDATE' ? (
            <MandateOverlay
              task={eventData.description}
              onComplete={closeEvent}
            />
          ) : (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-neutral-900 border-4 border-pink-500 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(236,72,153,0.5)] transform animate-in zoom-in-95 duration-300 relative overflow-hidden">
                <div className="text-pink-500 font-black text-xs tracking-widest uppercase mb-2">You Landed On</div>
                <h2 className="text-4xl font-black text-white mb-4 uppercase">{eventData.label}</h2>
                <div className="bg-pink-500/10 border border-pink-500/30 rounded-2xl p-6 mb-6">
                  <p className="text-xl text-pink-100 italic leading-relaxed">
                    "{eventData.description}"
                  </p>
                </div>
                
                {eventData.price > 0 && (
                  <div className="mb-8 flex items-center justify-between bg-neutral-800 p-4 rounded-xl border border-neutral-700">
                    <span className="text-neutral-400 font-bold uppercase text-sm">Required Tribute</span>
                    <span className="text-3xl font-black text-green-400">${eventData.price}</span>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={closeEvent}
                    className="w-full py-4 bg-white text-neutral-900 font-black rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95"
                  >
                    I OBEY, GODDESS
                  </button>
                  
                  <button 
                    onClick={closeEvent}
                    className="text-neutral-500 text-xs font-bold uppercase tracking-widest hover:text-pink-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Left: Board */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-black text-pink-500 uppercase tracking-tighter">Drain U Play</h1>
        <GameBoard players={state.players} currentPlayerId={playerId} />
      </div>

      {/* Right: Controls & Info */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        {/* Video Chat Section */}
        <div className="bg-neutral-800 p-6 rounded-2xl border-2 border-pink-500/30 shadow-xl">
          <h3 className="text-xl font-bold text-pink-400 mb-1 flex items-center gap-2">
            <Video size={20} /> Cam-to-Cam
          </h3>
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-4 font-bold">Best Effort P2P Connection</p>
          <VideoChat playerId={playerId} players={state.players} />
        </div>

        {/* Players Card */}
        <div className="bg-neutral-800 p-6 rounded-2xl border-2 border-pink-500/30 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-pink-400 flex items-center gap-2">
              <Users size={20} /> Players
            </h3>
            <span className="px-3 py-1 bg-neutral-700 rounded-full text-xs font-mono">
              {Object.keys(state.players).length} Online
            </span>
          </div>
          
          <div className="space-y-4 max-h-48 overflow-y-auto mb-6 pr-2 custom-scrollbar">
            {Object.values(state.players).map(p => {
              const tier = getDependencyTier(p.pos);
              const debtPercent = Math.min(Math.max((p.balance < 0 ? Math.abs(p.balance) : 0) / 2000 * 100, 0), 100);
              
              return (
                <div key={p.id} className={`flex flex-col p-3 rounded-xl transition-all ${state.turn === p.id ? 'bg-pink-500/20 border-2 border-pink-500/50 ring-1 ring-pink-500/30' : 'bg-neutral-800/50 border border-neutral-700'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <img src={tier.icon} className="w-6 h-6 object-contain" alt={tier.name} title={`Tier: ${tier.name}`} />
                      <span className="font-black text-sm truncate max-w-[100px] uppercase tracking-tight">{p.id === playerId ? 'YOU' : p.name}</span>
                    </div>
                    <span className={`font-mono font-bold ${p.balance < 0 ? 'text-red-500' : 'text-green-400'}`}>
                      ${p.balance.toFixed(2)}
                    </span>
                  </div>

                  {p.balance < 0 && (
                    <div className="mt-1 space-y-1">
                      <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-red-500/70">
                        <span>Debt Load</span>
                        <span>{debtPercent.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className={`h-full transition-all duration-1000 ${debtPercent > 80 ? 'bg-red-600 animate-pulse' : 'bg-pink-600'}`}
                          style={{ width: `${debtPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-1">
                      {p.debtTracker > 1 && (
                        <span className="text-[9px] bg-red-900/40 text-red-300 px-1.5 py-0.5 rounded border border-red-500/20 font-bold uppercase">
                          Interest: x{p.debtTracker.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex -space-x-2">
                      {Array.from({ length: p.loyaltyTokens || 0 }).map((_, i) => (
                        <img key={i} src="/loyalty_token.png" className="w-5 h-5 drop-shadow-md" alt="Loyalty Token" />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6 border-t border-neutral-700">
            {currentPlayer.banTurns > 0 ? (
              <div className="flex flex-col gap-3">
                <div className="text-center text-red-500 font-bold text-xs uppercase animate-pulse">You are Banned from Moving</div>
                <button
                  disabled={!isMyTurn}
                  onClick={handleRoll}
                  className={`w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-3 transition-all
                    ${isMyTurn 
                      ? 'bg-neutral-600 hover:bg-neutral-500 text-white shadow-lg' 
                      : 'bg-neutral-700 text-neutral-500 cursor-not-allowed opacity-50'}`}
                >
                  SKIP TURN ({currentPlayer.banTurns})
                </button>
                <button
                  disabled={!isMyTurn}
                  onClick={handleBribe}
                  className={`w-full py-4 rounded-xl font-black text-xl flex items-center justify-center gap-3 transition-all
                    ${isMyTurn 
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 shadow-[0_0_20px_rgba(236,72,153,0.4)]' 
                      : 'bg-neutral-700 text-neutral-500 cursor-not-allowed opacity-50'}`}
                >
                  <Wallet size={24} /> BRIBE GODDESS ($75)
                </button>
              </div>
            ) : (
              <button
                disabled={!isMyTurn}
                onClick={handleRoll}
                className={`w-full py-4 rounded-xl font-black text-xl flex items-center justify-center gap-3 transition-all
                  ${isMyTurn 
                    ? 'bg-pink-500 hover:bg-pink-600 shadow-[0_0_20px_rgba(236,72,153,0.4)] scale-100 active:scale-95' 
                    : 'bg-neutral-700 text-neutral-500 cursor-not-allowed opacity-50'}`}
              >
                <Dice6 size={28} /> {isMyTurn ? 'ROLL DICE' : 'WAITING...'}
              </button>
            )}
          </div>
        </div>

        {/* Space Info */}
        <div className="bg-pink-500/10 p-6 rounded-2xl border-2 border-pink-400 shadow-xl min-h-[150px] relative overflow-hidden">
          <h3 className="text-pink-400 font-bold uppercase text-sm mb-2 tracking-widest flex items-center gap-2 relative z-10">
             Current Space
          </h3>
          {lastSpace && (
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-1">
                <div className="text-2xl font-black">{lastSpace.label}</div>
                <img src={getDependencyTier(currentPlayer.pos).icon} className="w-6 h-6 object-contain opacity-80" alt="Tier" />
              </div>
              <div className="text-pink-300/80 italic text-sm leading-relaxed">
                {lastSpace.description || "The Goddess is watching your next move..."}
              </div>
              {lastSpace.price > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-pink-500 text-white rounded-full font-bold text-sm">
                  <Wallet size={14} /> Tribute: ${lastSpace.price}
                </div>
              )}
            </div>
          )}
          {/* Subtle tier background icon */}
          {lastSpace && (
            <img 
              src={getDependencyTier(currentPlayer.pos).icon} 
              className="absolute -right-4 -bottom-4 w-32 h-32 object-contain opacity-5 pointer-events-none" 
              alt="" 
            />
          )}
        </div>

        {/* History */}
        <div className="bg-neutral-800/50 p-6 rounded-2xl border-2 border-neutral-700 flex-1 min-h-[200px]">
          <h3 className="text-neutral-400 font-bold uppercase text-sm mb-4 tracking-widest flex items-center gap-2">
            <History size={16} /> Session Log
          </h3>
          <div className="space-y-3 font-mono text-xs text-neutral-500">
            {state.history.map((h, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-left-2">{h}</div>
            ))}
            {state.history.length === 0 && <div className="italic">Game session started...</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<GoddessDashboard />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<div className="min-h-screen bg-pink-100 flex items-center justify-center">Payment Cancelled. <a href="/" className="text-pink-600 ml-2 font-bold underline">Try again?</a></div>} />
      </Routes>
    </Router>
  )
}

export default App
