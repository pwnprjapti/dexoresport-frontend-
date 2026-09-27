import { useState, useEffect } from "react"
import ControlPanel from "../compo/controlPanel"
import styles from "../css/integrations.module.css"
import Loading from "../compo/Loading"

export default function Integrations() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const [connections, setConnections] = useState({
        telegramToken: "",
        telegramChatId: "",
        telegramConnected: false,
        discordWebhook: "",
        discordChannel: "",
        discordConnected: false,
        whatsappNumber: "",
        whatsappGroupLink: "",
        whatsappConnected: false
    });

    const [triggers, setTriggers] = useState({
        onRegister: true,
        onBracketGenerate: true,
        onResultAnnounce: true,
        onMatchReminder: false
    });

    if (loading) {
        return <Loading />;
    }

    const handleConnect = (platform) => {
        if (platform === "telegram") {
            if (!connections.telegramToken || !connections.telegramChatId) {
                alert("Please enter both Bot Token and Chat/Channel ID.");
                return;
            }
            setConnections(prev => ({ ...prev, telegramConnected: !prev.telegramConnected }));
            alert(connections.telegramConnected ? "Telegram disconnected." : "Telegram Bot connected successfully! Automated tournament broadcasts are now active.");
        } else if (platform === "discord") {
            if (!connections.discordWebhook) {
                alert("Please enter a valid Discord Webhook URL.");
                return;
            }
            setConnections(prev => ({ ...prev, discordConnected: !prev.discordConnected }));
            alert(connections.discordConnected ? "Discord disconnected." : "Discord Webhook connected successfully! Live game logs will be posted automatically.");
        } else if (platform === "whatsapp") {
            if (!connections.whatsappGroupLink) {
                alert("Please enter a valid WhatsApp Group invite link.");
                return;
            }
            setConnections(prev => ({ ...prev, whatsappConnected: !prev.whatsappConnected }));
            alert(connections.whatsappConnected ? "WhatsApp disconnected." : "WhatsApp automation service connected successfully!");
        }
    };

    const handleTriggerChange = (name) => {
        setTriggers(prev => ({ ...prev, [name]: !prev[name] }));
    };

    return (
        <>
            <ControlPanel />
            <div className={styles.integrationsContainer}>
                <div className={styles.header}>
                    <div className={styles.titleArea}>
                        <h1>Automated Broadcast Integrations</h1>
                        <p>Connect your Telegram, Discord, and WhatsApp groups. Get automatic tournament updates, match grids, and result announcements pushed directly to your communities.</p>
                    </div>
                </div>

                <div className={styles.cardsGrid}>
                    {/* Telegram Integration Card */}
                    <div className={`${styles.integrationCard} ${connections.telegramConnected ? styles.connected : ""}`}>
                        <div className={styles.cardHeader}>
                            <div className={styles.platformIcon} style={{ color: "#0088cc" }}>
                                <i className="fa-brands fa-telegram"></i>
                            </div>
                            <span className={`${styles.statusLabel} ${connections.telegramConnected ? styles.statusActive : ""}`}>
                                {connections.telegramConnected ? "ACTIVE" : "DISCONNECTED"}
                            </span>
                        </div>
                        <h3>Telegram Broadcast Bot</h3>
                        <p>Send instant match reports and registration status alerts to channels or chats.</p>
                        
                        <div className={styles.formGroup}>
                            <label>Bot Access Token</label>
                            <input 
                                type="text" 
                                placeholder="123456789:ABCdefGhI..." 
                                value={connections.telegramToken}
                                onChange={(e) => setConnections(prev => ({ ...prev, telegramToken: e.target.value }))}
                                disabled={connections.telegramConnected}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Group / Channel Username or ID</label>
                            <input 
                                type="text" 
                                placeholder="@my_esports_channel" 
                                value={connections.telegramChatId}
                                onChange={(e) => setConnections(prev => ({ ...prev, telegramChatId: e.target.value }))}
                                disabled={connections.telegramConnected}
                            />
                        </div>
                        <button 
                            className={`${styles.btnConnect} ${connections.telegramConnected ? styles.btnDisconnect : ""}`}
                            onClick={() => handleConnect("telegram")}
                        >
                            {connections.telegramConnected ? "Disconnect Bot" : "Configure Telegram"}
                        </button>
                    </div>

                    {/* Discord Integration Card */}
                    <div className={`${styles.integrationCard} ${connections.discordConnected ? styles.connected : ""}`}>
                        <div className={styles.cardHeader}>
                            <div className={styles.platformIcon} style={{ color: "#5865F2" }}>
                                <i className="fa-brands fa-discord"></i>
                            </div>
                            <span className={`${styles.statusLabel} ${connections.discordConnected ? styles.statusActive : ""}`}>
                                {connections.discordConnected ? "ACTIVE" : "DISCONNECTED"}
                            </span>
                        </div>
                        <h3>Discord Webhooks</h3>
                        <p>Post live brackets, custom stats cards, and match tables in your Discord server channels.</p>
                        
                        <div className={styles.formGroup}>
                            <label>Webhook endpoint URL</label>
                            <input 
                                type="text" 
                                placeholder="https://discord.com/api/webhooks/..." 
                                value={connections.discordWebhook}
                                onChange={(e) => setConnections(prev => ({ ...prev, discordWebhook: e.target.value }))}
                                disabled={connections.discordConnected}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Output Channel Name (Optional)</label>
                            <input 
                                type="text" 
                                placeholder="#tournament-announcements" 
                                value={connections.discordChannel}
                                onChange={(e) => setConnections(prev => ({ ...prev, discordChannel: e.target.value }))}
                                disabled={connections.discordConnected}
                            />
                        </div>
                        <button 
                            className={`${styles.btnConnect} ${connections.discordConnected ? styles.btnDisconnect : ""}`}
                            onClick={() => handleConnect("discord")}
                        >
                            {connections.discordConnected ? "Disconnect Webhook" : "Configure Discord"}
                        </button>
                    </div>

                    {/* WhatsApp Integration Card */}
                    <div className={`${styles.integrationCard} ${connections.whatsappConnected ? styles.connected : ""}`}>
                        <div className={styles.cardHeader}>
                            <div className={styles.platformIcon} style={{ color: "#25D366" }}>
                                <i className="fa-brands fa-whatsapp"></i>
                            </div>
                            <span className={`${styles.statusLabel} ${connections.whatsappConnected ? styles.statusActive : ""}`}>
                                {connections.whatsappConnected ? "ACTIVE" : "DISCONNECTED"}
                            </span>
                        </div>
                        <h3>WhatsApp Automation</h3>
                        <p>Share slots, tournament registration links, and chicken dinner graphics to WhatsApp groups.</p>
                        
                        <div className={styles.formGroup}>
                            <label>WhatsApp Group Invite Link</label>
                            <input 
                                type="text" 
                                placeholder="https://chat.whatsapp.com/..." 
                                value={connections.whatsappGroupLink}
                                onChange={(e) => setConnections(prev => ({ ...prev, whatsappGroupLink: e.target.value }))}
                                disabled={connections.whatsappConnected}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Admin Mobile Number (Optional)</label>
                            <input 
                                type="text" 
                                placeholder="+91 98765 43210" 
                                value={connections.whatsappNumber}
                                onChange={(e) => setConnections(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                                disabled={connections.whatsappConnected}
                            />
                        </div>
                        <button 
                            className={`${styles.btnConnect} ${connections.whatsappConnected ? styles.btnDisconnect : ""}`}
                            onClick={() => handleConnect("whatsapp")}
                        >
                            {connections.whatsappConnected ? "Disconnect Group" : "Configure WhatsApp"}
                        </button>
                    </div>
                </div>

                {/* Broadcast Automations Settings */}
                <div className={styles.broadcastSettingsCard}>
                    <h3>Automated Broadcast Triggers</h3>
                    <p>Select which events will trigger automatic notifications in your connected communities.</p>
                    
                    <div className={styles.triggerOptions}>
                        <label className={styles.checkboxLabel}>
                            <input 
                                type="checkbox" 
                                checked={triggers.onRegister}
                                onChange={() => handleTriggerChange("onRegister")}
                            />
                            <div className={styles.checkboxInfo}>
                                <span>Player/Team Registration Notifications</span>
                                <small>Post a dynamic card when a new team registers for a tournament.</small>
                            </div>
                        </label>
                        
                        <label className={styles.checkboxLabel}>
                            <input 
                                type="checkbox" 
                                checked={triggers.onBracketGenerate}
                                onChange={() => handleTriggerChange("onBracketGenerate")}
                            />
                            <div className={styles.checkboxInfo}>
                                <span>Tournament Bracket & Matchup Generation</span>
                                <small>Post match tables and tournament brackets automatically once generated.</small>
                            </div>
                        </label>

                        <label className={styles.checkboxLabel}>
                            <input 
                                type="checkbox" 
                                checked={triggers.onResultAnnounce}
                                onChange={() => handleTriggerChange("onResultAnnounce")}
                            />
                            <div className={styles.checkboxInfo}>
                                <span>Result Announcements & MVP updates</span>
                                <small>Broadcast final chicken dinner graphics, rankings, and MVP lists automatically.</small>
                            </div>
                        </label>

                        <label className={styles.checkboxLabel}>
                            <input 
                                type="checkbox" 
                                checked={triggers.onMatchReminder}
                                onChange={() => handleTriggerChange("onMatchReminder")}
                            />
                            <div className={styles.checkboxInfo}>
                                <span>Match Timing Reminders</span>
                                <small>Send alerts to chat groups 15 minutes before the match lobby starts.</small>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
}
