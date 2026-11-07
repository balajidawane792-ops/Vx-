import React, { useEffect, useMemo, useState } from "react";

const ENTRY_FEE = 5;
const PRIZE_PERCENT = 0.8;
const STORAGE_KEY = "vx-ff-tournament-v1";

const initialState = {
  tournamentName: "VX FF Tournament",
  mode: "Squad",
  maxPlayers: 48,
  players: [],
  roomId: "",
  roomPassword: "",
  winner: "",
};

export default function App() {
  const [data, setData] = useState(() => {
    try {
      return {
        ...initialState,
        ...JSON.parse(
          localStorage.getItem(STORAGE_KEY) || "{}"
        )
      };
    } catch {
      return initialState;
    }
  });

  const [name, setName] = useState("");
  const [uid, setUid] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );
  }, [data]);

  const count = data.players.length;
  const total = count * ENTRY_FEE;
  const prizePool = Math.floor(total * PRIZE_PERCENT);
  const remaining = Math.max(
    0,
    Number(data.maxPlayers) - count
  );

  const update = (patch) =>
    setData((current) => ({
      ...current,
      ...patch
    }));

  function registerPlayer(event) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanUid = uid.trim();

    if (
      !cleanName ||
      !/^\d{5,20}$/.test(cleanUid)
    ) {
      setMessage(
        "नाम और सही UID डालो।"
      );
      return;
    }

    if (
      data.players.some(
        (player) => player.uid === cleanUid
      )
    ) {
      setMessage("यह UID पहले से रजिस्टर है।");
      return;
    }

    if (count >= Number(data.maxPlayers)) {
      setMessage("सभी स्लॉट भर चुके हैं।");
      return;
    }

    update({
      players: [
        ...data.players,
        {
          name: cleanName,
          uid: cleanUid
        }
      ]
    });

    setName("");
    setUid("");

    setMessage("Registration Successful!");
  }

  function loginAdmin(event) {
    event.preventDefault();

    if (adminPassword === "vxadmin123") {
      setIsAdmin(true);
      setAdminOpen(false);
      setAdminPassword("");
      setMessage("Admin Login Successful!");
    } else {
      setMessage("Wrong Password!");
    }
  }

  function removePlayer(uidToRemove) {
    update({
      players: data.players.filter(
        (player) => player.uid !== uidToRemove
      )
    });
  }

  const sortedPlayers = useMemo(
    () => data.players,
    [data.players]
  );

  return (
    <main className="app-shell">
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #0b1020;
          color: #f7f8fc;
          font-family: Arial, sans-serif;
        }

        .app-shell {
          max-width: 760px;
          margin: auto;
          padding: 22px 16px 50px;
        }

        .hero, .panel {
          background: #151d33;
          border: 1px solid #293653;
          border-radius: 18px;
          padding: 20px;
          margin-bottom: 16px;
        }

        .hero {
          background: linear-gradient(
            135deg,
            #202c50,
            #151d33
          );
        }

        h1 {
          margin: 0 0 6px;
          font-size: 29px;
        }

        h2 {
          font-size: 19px;
          margin: 0 0 15px;
        }

        .muted {
          color: #aeb9d2;
          font-size: 14px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 18px;
        }

        .stat {
          background: #0e1629;
          border-radius: 12px;
          padding: 13px;
        }

        .stat strong {
          display: block;
          font-size: 23px;
          margin-top: 5px;
        }

        label {
          display: block;
          font-size: 14px;
          color: #c8d2e8;
          margin: 12px 0 6px;
        }

        input, select {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #394968;
          background: #0e1629;
          color: white;
          font-size: 15px;
        }

        button {
          border: 0;
          border-radius: 10px;
          padding: 12px 15px;
          background: #6d7cff;
          color: white;
          font-weight: 700;
          cursor: pointer;
        }

        button.secondary {
          background: #293653;
        }

        button.danger {
          background: #9f3448;
          padding: 8px 10px;
        }

        .full {
          width: 100%;
          margin-top: 14px;
        }

        .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap
                <section className="hero">
        <div className="row">
          <div>
            <h1>🔥 VX FF Tournament</h1>
            <div className="muted">Free Fire Tournament Manager</div>
          </div>
          <button
            className="secondary"
            onClick={() => setAdminOpen(true)}
          >
            Admin
          </button>
        </div>

        <div className="stats">
          <div className="stat">
            <span className="muted">Entry Fee</span>
            <strong>₹{ENTRY_FEE}</strong>
            <span className="muted">प्रति खिलाड़ी</span>
          </div>
          <div className="stat">
            <span className="muted">Prize Pool</span>
            <strong>₹{prizePool}</strong>
            <span className="muted">कुल जमा का 80%</span>
          </div>
          <div className="stat">
            <span className="muted">खाली स्लॉट</span>
            <strong>{remaining}</strong>
            <span className="muted">कुल {data.maxPlayers}</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2>🏆 Tournament Details</h2>

        {isAdmin ? (
          <>
            <label>Tournament Name</label>
            <input
              value={data.tournamentName}
              onChange={(e) =>
                update({ tournamentName: e.target.value })
              }
            />

            <label>Game Mode</label>
            <select
              value={data.mode}
              onChange={(e) =>
                update({ mode: e.target.value })
              }
            >
              <option>Solo</option>
              <option>Duo</option>
              <option>Squad</option>
            </select>

            <label>Maximum Players</label>
            <select
              value={data.maxPlayers}
              onChange={(e) =>
                update({ maxPlayers: Number(e.target.value) })
              }
            >
              {[12, 24, 48, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </>
        ) : (
          <>
            <div><strong>{data.tournamentName}</strong></div>
            <p className="muted">
              Mode: {data.mode} · Entry: ₹5 · Prize pool: 80% of collected entry fees
            </p>
          </>
        )}

        <div className="row">
          <span className="muted">
            Registered: {count} / {data.maxPlayers}
          </span>
          <strong>
            {Math.round((count / Number(data.maxPlayers)) * 100)}%
          </strong>
        </div>

        <div className="progress">
          <div
            style={{
              width: `${Math.min(
                100,
                (count / Number(data.maxPlayers)) * 100
              )}%`
            }}
          />
        </div>
      </section>

      <section className="panel">
        <h2>📝 Player Registration</h2>

        <form onSubmit={registerPlayer}>
          <label>Player Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="अपना नाम लिखें"
          />

          <label>Free Fire UID</label>
          <input
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="अपनी UID लिखें"
            inputMode="numeric"
          />

          <button className="full" type="submit">
            Register Player
          </button>
        </form>

        <p className="notice">
          Entry fee ₹5 प्रति खिलाड़ी है। यह डेमो केवल रजिस्ट्रेशन दिखाता है;
          ऑनलाइन पेमेंट अपने आप नहीं लेता।
        </p>

        {message && <div className="message">{message}</div>}
      </section>

      <section className="panel">
        <h2>👥 Registered Players</h2>

        {sortedPlayers.length === 0 ? (
          <p className="muted">अभी कोई खिलाड़ी रजिस्टर नहीं हुआ।</p>
        ) : (
          sortedPlayers.map((player, index) => (
            <div className="player" key={player.uid}>
              <div>
                <strong>{index + 1}. {player.name}</strong>
                <div className="muted">UID: {player.uid}</div>
              </div>

              {isAdmin && (
                <button
                  className="danger"
                  onClick={() => removePlayer(player.uid)}
                >
                  Remove
                </button>
              )}
            </div>
          ))
        )}
      </section>

      <section className=
        "panel">
        <h2>🎮 Room Details</h2>

        {isAdmin ? (
          <>
            <label>Room ID</label>
            <input
              value={data.roomId}
              onChange={(e) =>
                update({ roomId: e.target.value })
              }
              placeholder="Room ID डालें"
            />

            <label>Room Password</label>
            <input
              value={data.roomPassword}
              onChange={(e) =>
                update({ roomPassword: e.target.value })
              }
              placeholder="Room Password डालें"
            />

            <label>Winner Name</label>
            <input
              value={data.winner}
              onChange={(e) =>
                update({ winner: e.target.value })
              }
              placeholder="Winner का नाम"
            />
          </>
        ) : (
          <>
            <p className="muted">
              Room ID: {data.roomId || "अभी जारी नहीं हुआ"}
            </p>
            <p className="muted">
              Room Password: {data.roomPassword || "अभी जारी नहीं हुआ"}
            </p>
            <p className="muted">
              Winner: {data.winner || "अभी घोषित नहीं हुआ"}
            </p>
          </>
        )}
      </section>

      {adminOpen && (
        <section className="panel">
          <h2>🔐 Admin Login</h2>
          <form onSubmit={loginAdmin}>
            <label>Admin Password</label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) =>
                setAdminPassword(e.target.value)
              }
              placeholder="Password डालें"
            />
            <button className="full" type="submit">
              Login
            </button>
          </form>
          <button
            className="secondary full"
            onClick={() => setAdminOpen(false)}
          >
            Cancel
          </button>
        </section>
      )}

      {isAdmin && (
        <button
          className="secondary full"
          onClick={() => setIsAdmin(false)}
        >
          Admin Logout
        </button>
      )}

      <p className="notice">
        यह अभी एक डेमो ऐप है। डेटा इसी ब्राउज़र में सेव होता है।
        असली ऑनलाइन टूर्नामेंट के लिए सर्वर, डेटाबेस और पेमेंट
        सिस्टम अलग से जोड़ना होगा।
      </p>
    </main>
  );
}
