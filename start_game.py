#!/usr/bin/env python3
"""
Steampunk Slot Machine RPG - Quick Start Script
Simple script to launch the game server with one command.
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

def find_available_port(start_port=8000, max_attempts=10):
    """Find an available port starting from start_port"""
    import socket
    
    for port in range(start_port, start_port + max_attempts):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('localhost', port))
                return port
        except OSError:
            continue
    return None

def start_game_server():
    """Start the game server and open browser"""
    
    print("🎮 Steampunk Slot Machine RPG - Quick Start")
    print("=" * 45)
    
    # Change to game directory
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Find available port
    port = find_available_port()
    if not port:
        print("❌ No available ports found. Please close other applications and try again.")
        return False
    
    try:
        # Create and start server
        handler = http.server.SimpleHTTPRequestHandler
        server = socketserver.TCPServer(("", port), handler)
        
        game_url = f"http://localhost:{port}"
        
        print(f"🚀 Starting game server on port {port}")
        print(f"🌐 Game URL: {game_url}")
        print(f"📂 Serving files from: {script_dir}")
        
        # Try to open browser automatically
        try:
            print("🔗 Opening game in your default browser...")
            webbrowser.open(game_url)
        except Exception as e:
            print(f"⚠️  Could not auto-open browser: {e}")
            print(f"   Please manually open: {game_url}")
        
        print("\n🎯 Game Controls:")
        print("   • SPACE: Spin the slot machine")
        print("   • H: Help menu")
        print("   • S: Settings")
        print("   • ESC: Close dialogs")
        
        print("\n⏳ Server is running... Press Ctrl+C to stop")
        print("=" * 45)
        
        # Start server
        server.serve_forever()
        
    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down server...")
        server.shutdown()
        server.server_close()
        print("✅ Server stopped. Thanks for playing!")
        return True
        
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        return False

if __name__ == "__main__":
    try:
        start_game_server()
    except KeyboardInterrupt:
        print("\n👋 Goodbye!")
        sys.exit(0)