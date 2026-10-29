# Olympus

โปรเจกต์บอทหลายแพลตฟอร์ม

🔗 **ใช้งานออนไลน์:** https://saharatyokthuan.github.io/Olympus/

## โครงสร้าง

```
Olympus/
├── Apollo/           # Telegram Bot (Telegraf)
│   └── telegram-bot/
│       ├── src/
│       ├── package.json
│       └── README.md
│
└── Artemis/          # Discord Bot (discord.js v14)
    ├── src/
    ├── package.json
    └── README.md
```

## เริ่มต้นใช้งาน

### Telegram Bot (Apollo)
```bash
cd Apollo/telegram-bot
cp .env.example .env
# ใส่ BOT_TOKEN ใน .env
npm install
npm start
```

### Discord Bot (Artemis)
```bash
cd Artemis
cp .env.example .env
# ใส่ DISCORD_TOKEN ใน .env
npm install
npm start
```

## Environment Variables

| Bot | Variable | Source |
|-----|----------|--------|
| Telegram | `BOT_TOKEN` | [@BotFather](https://t.me/BotFather) |
| Discord | `DISCORD_TOKEN` | [Discord Developer Portal](https://discord.com/developers/applications) |

## Dependencies

| Bot | Library | Version |
|-----|---------|---------|
| Telegram | telegraf | ^4.15.3 |
| Discord | discord.js | ^14.14.1 |
| Both | dotenv | ^16.3.1 |

## License

MIT