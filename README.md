# Enhanced Steampunk Slot Machine RPG

A fully-featured web-based slot machine game with RPG elements, steampunk pixel art aesthetics, and advanced gameplay mechanics.

## 🎮 Game Overview

Battle through multiple steampunk worlds using a slot machine to deal damage to bosses. The enhanced version includes power-ups, combo systems, achievements, and much more!

## ✨ Enhanced Features

### 🎰 Core Gameplay
- **Slot Machine Combat**: Match 3 symbols to deal damage to bosses
- **8 Unique Symbols**: Each with different damage values and rarities
- **Progressive Boss Battles**: Defeat bosses to advance through worlds

### ⚡ Power-up System
- **Double Damage**: Next attack deals 2x damage (3 turns)
- **Steam Healing**: Instantly restore 30 health points
- **Mechanical Shield**: Block next 2 enemy attacks
- **Multi-Spin**: Receive 3 free spins
- **Combo Boost**: Increase combo multiplier by 1 (5 turns)
- **Random Activation**: 5% chance per spin

### 🔥 Combo & Bonus Systems
- **Combo Multiplier**: Consecutive wins increase damage (up to 5x)
- **Critical Hits**: 15% chance for 1.5x damage with screen shake
- **Free Spins**: Earned from power-ups and boss defeats
- **Progressive Jackpot**: Build progress for massive bonus rewards

### 🌍 World Progression
- **3 Themed Worlds**:
  - Mechanical Foundry (Industrial theme)
  - Steam Gardens (Nature theme) 
  - Sky Fortress (Aerial theme)
- **World Unlocking**: Progress by defeating bosses
- **Dynamic Backgrounds**: Each world has unique visual themes
- **Scaling Difficulty**: Bosses get stronger in later worlds

### 🏆 Achievement System
- **7 Achievements** to unlock:
  - First Victory: Win your first slot spin
  - Boss Slayer: Defeat your first boss
  - Damage Dealer: Deal 500 total damage
  - Critical Master: Land 10 critical hits
  - Spin Master: Complete 100 spins
  - World Explorer: Unlock all worlds
  - Jackpot Winner: Hit the jackpot combination

### 🎨 Enhanced Animations & Effects
- **Smooth Reel Animations**: Staggered spinning with easing
- **Screen Shake Effects**: Different intensities for various events
- **Floating Damage Numbers**: Animated damage indicators
- **Particle Effects**: Visual feedback for wins and special events
- **Power-up Glows**: Visual indicators for active bonuses
- **Critical Hit Effects**: Enhanced visuals for critical strikes

### 💾 Quality of Life Features
- **Auto-Save**: Progress automatically saved to localStorage
- **Settings Menu**: Toggle sound, animations, and auto-spin
- **Help System**: Comprehensive tutorial and controls guide
- **Keyboard Controls**: 
  - SPACE: Spin
  - H: Help
  - S: Settings
  - ESC: Close modals
- **Responsive Design**: Works on desktop, tablet, and mobile

### 📊 Advanced Statistics
- **Detailed Tracking**:
  - Total score with comma formatting
  - Spin count and win rate
  - Bosses defeated across all worlds
  - Total damage dealt
  - Critical hits landed
- **Real-time Updates**: All stats update dynamically

## 🎯 How to Play

### Basic Controls
1. **Spin**: Click the SPIN button or press SPACE
2. **Match Symbols**: Get 3 matching symbols to deal damage
3. **Defeat Bosses**: Reduce boss health to 0 to progress
4. **Survive**: Don't let your health reach 0

### Advanced Strategies
- **Build Combos**: Chain wins for massive damage multipliers
- **Use Power-ups Wisely**: Save shields for tough bosses
- **Manage Health**: Use healing power-ups strategically
- **Target High-Value Symbols**: Crystal symbols deal most damage
- **Free Spin Management**: Use free spins during combo streaks

### Symbol Values & Rarities
- **Crystal** (35 DMG, 10% rarity) - Highest damage, jackpot potential
- **Sword** (30 DMG, 15% rarity) - High damage attack symbol
- **Shield** (25 DMG, 15% rarity) - Balanced defense symbol
- **Armor** (22 DMG, 10% rarity) - Strong defensive option
- **Gear** (20 DMG, 20% rarity) - Most common mechanical symbol
- **Pipe** (15 DMG, 15% rarity) - Steam-powered symbol
- **Potion** (10 DMG, 10% rarity) - Healing-themed symbol
- **Button** (5 DMG, 5% rarity) - Utility symbol, lowest damage

## 🏗️ Technical Implementation

### Architecture
- **HTML5**: Semantic structure with accessibility features
- **CSS3**: Advanced animations, responsive grid layouts
- **Vanilla JavaScript**: Object-oriented game engine (1,300+ lines)
- **LocalStorage**: Persistent save system
- **Modular Design**: Separate classes for game state, UI, and logic

### Performance Features
- **Efficient Animations**: CSS transforms and transitions
- **Memory Management**: Proper cleanup of temporary elements
- **Optimized Rendering**: Minimal DOM manipulation
- **Responsive Images**: Pixel-perfect scaling for all devices

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Support**: Touch-friendly interface
- **Progressive Enhancement**: Graceful degradation for older browsers

## 🚀 Getting Started

### Quick Start (Easiest Method)
**For the fastest setup, use the included startup script:**

1. **Navigate to the game directory**:
   ```bash
   cd final
   ```

2. **Run the quick start script**:
   ```bash
   python3 start_game.py
   ```

3. **The script will automatically**:
   - Find an available port (8000, 8001, 8002, etc.)
   - Start the HTTP server
   - Open your default web browser
   - Display the game URL and controls

4. **Play the game**: The browser should open automatically to the game
5. **Stop the server**: Press `Ctrl+C` in the terminal

### Local Hosting Setup

#### Method 1: Python HTTP Server (Recommended)
**Requirements**: Python 3.x installed on your system

1. **Navigate to game directory**:
   ```bash
   cd final
   ```

2. **Start Python HTTP server**:
   ```bash
   # For Python 3.x (recommended)
   python3 -m http.server 8000
   
   # Alternative for Python 2.x
   python -m SimpleHTTPServer 8000
   ```

3. **Access the game**:
   - Open your web browser
   - Navigate to: `http://localhost:8000`
   - The game will load automatically

4. **Stop the server**:
   - Press `Ctrl+C` in the terminal to stop the server

#### Method 2: Node.js HTTP Server (Alternative)
**Requirements**: Node.js installed on your system

1. **Install http-server globally**:
   ```bash
   npm install -g http-server
   ```

2. **Navigate to game directory and start server**:
   ```bash
   cd final
   http-server -p 8000
   ```

3. **Access the game**: Navigate to `http://localhost:8000`

#### Method 3: Other Simple Servers

**PHP Built-in Server**:
```bash
cd final
php -S localhost:8000
```

**Ruby Server**:
```bash
cd final
ruby -run -e httpd . -p 8000
```

### Direct File Access (Limited Functionality)
⚠️ **Not Recommended**: Opening `index.html` directly in browser may cause issues with:
- Asset loading due to CORS restrictions
- LocalStorage functionality
- Some animations and effects

### System Requirements
- **Operating System**: Windows, macOS, or Linux
- **Python**: Version 3.6 or higher (for Python server method)
- **Web Browser**: Modern browser with JavaScript enabled
- **RAM**: Minimum 512MB available
- **Storage**: ~5MB for game files and save data

### Browser Compatibility
✅ **Fully Supported**:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

⚠️ **Limited Support**:
- Internet Explorer 11 (some features may not work)
- Older mobile browsers

### Port Configuration
- **Default Port**: 8000
- **Alternative Ports**: If port 8000 is busy, try:
  ```bash
  python3 -m http.server 8080
  python3 -m http.server 3000
  python3 -m http.server 9000
  ```
- **Check Port Availability**:
  ```bash
  # Linux/macOS
  lsof -i :8000
  
  # Windows
  netstat -an | findstr :8000
  ```

### Access URLs
Once server is running, access the game via:
- **Local Access**: `http://localhost:8000`
- **Network Access**: `http://[YOUR_IP]:8000` (for other devices on same network)
- **IPv6**: `http://[::1]:8000`

### Troubleshooting Guide

#### Server Won't Start
**Problem**: "Address already in use" error
**Solution**: 
- Use a different port: `python3 -m http.server 8080`
- Kill existing process: `pkill -f "http.server"`

**Problem**: "Python not found" error
**Solution**:
- Install Python from python.org
- Use `python` instead of `python3` on some systems
- Check installation: `python --version`

#### Game Won't Load
**Problem**: Blank page or loading issues
**Solution**:
- Ensure you're accessing via HTTP (not file://)
- Check browser console for errors (F12)
- Try different browser
- Clear browser cache

**Problem**: Assets not loading
**Solution**:
- Verify all files are in correct directory structure
- Check file permissions (should be readable)
- Ensure server is serving from correct directory

#### Performance Issues
**Problem**: Game runs slowly
**Solution**:
- Disable animations in Settings menu
- Close other browser tabs
- Try different browser
- Check system resources

#### Save Data Issues
**Problem**: Progress not saving
**Solution**:
- Enable cookies/localStorage in browser
- Check browser privacy settings
- Try incognito/private mode to test
- Clear browser data and restart

### Network Access Setup
To allow other devices on your network to access the game:

1. **Find your IP address**:
   ```bash
   # Linux/macOS
   ifconfig | grep inet
   
   # Windows
   ipconfig
   ```

2. **Start server with network binding**:
   ```bash
   python3 -m http.server 8000 --bind 0.0.0.0
   ```

3. **Access from other devices**: `http://[YOUR_IP]:8000`

4. **Firewall considerations**: May need to allow port 8000 through firewall

### Development Mode
For development and testing:
```bash
# Start with verbose logging
python3 -m http.server 8000 --bind 0.0.0.0 --directory final

# Monitor server logs
tail -f server.log
```

### File Structure
```
final/
├── index.html          # Main game file
├── css/
│   └── style.css       # Complete styling (1,100+ lines)
├── js/
│   └── game.js         # Game engine (1,300+ lines)
├── assets/
│   └── images/         # 16 pixel art assets
└── README.md           # This documentation
```

## 🎨 Asset Credits

All pixel art assets are custom-created for this game:
- **Characters**: Engineer, Warrior sprites
- **Bosses**: Mechanical Spider, Steam Golem, Airship Captain
- **Slot Symbols**: 8 unique steampunk-themed symbols
- **UI Elements**: Buttons, frames, and interface components

## 🔧 Customization

### Adding New Features
- **New Power-ups**: Add to `POWER_UPS` configuration
- **Additional Worlds**: Extend `WORLDS` array with new themes
- **More Bosses**: Add to `BOSSES` array with unique abilities
- **Extra Achievements**: Define in `ACHIEVEMENTS` object

### Balancing
- **Damage Values**: Modify symbol damage in `SLOT_SYMBOLS`
- **Rarity Rates**: Adjust symbol appearance frequency
- **Boss Difficulty**: Scale health and attack damage
- **Power-up Frequency**: Change activation probability

## 🐛 Known Issues & Future Enhancements

### Potential Improvements
- **Sound System**: Add audio effects and background music
- **More Animations**: Particle systems and advanced effects
- **Multiplayer**: Online leaderboards and competitions
- **Story Mode**: Narrative elements and character development
- **Mobile App**: Native mobile application version

### Performance Notes
- Game runs smoothly on modern devices
- Animations can be disabled for better performance
- LocalStorage has ~5MB limit for save data

## 📝 Version History

### v2.0 - Enhanced Edition
- Added power-up system with 5 unique power-ups
- Implemented combo multiplier and critical hit mechanics
- Created world progression system with 3 themed worlds
- Built comprehensive achievement system
- Enhanced animations and visual effects
- Added auto-save/load functionality
- Implemented settings and help systems
- Improved responsive design and accessibility

### v1.0 - Original Release
- Basic slot machine mechanics
- Simple boss battle system
- Core RPG elements
- Pixel art integration

---

**Total Code**: 2,579 lines across HTML, CSS, and JavaScript
**Development Time**: Enhanced with advanced features and polish
**Target Audience**: Casual gamers who enjoy RPG and slot mechanics

Enjoy your steampunk adventure! 🎰⚙️✨