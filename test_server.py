#!/usr/bin/env python3
"""
Steampunk Slot Machine RPG - Server Testing Script
This script tests the local hosting setup and validates game functionality.
"""

import http.server
import socketserver
import threading
import time
import urllib.request
import urllib.error
import os
import sys
from pathlib import Path

class GameServerTester:
    def __init__(self, port=8000):
        self.port = port
        self.server = None
        self.server_thread = None
        self.base_url = f"http://localhost:{port}"
        
    def start_server(self):
        """Start the HTTP server in a separate thread"""
        try:
            # Change to the game directory
            os.chdir(Path(__file__).parent)
            
            # Create server
            handler = http.server.SimpleHTTPRequestHandler
            self.server = socketserver.TCPServer(("", self.port), handler)
            
            # Start server in thread
            self.server_thread = threading.Thread(target=self.server.serve_forever)
            self.server_thread.daemon = True
            self.server_thread.start()
            
            print(f"✅ Server started on port {self.port}")
            return True
            
        except OSError as e:
            if "Address already in use" in str(e):
                print(f"❌ Port {self.port} is already in use")
                return False
            else:
                print(f"❌ Failed to start server: {e}")
                return False
    
    def stop_server(self):
        """Stop the HTTP server"""
        if self.server:
            self.server.shutdown()
            self.server.server_close()
            print("🛑 Server stopped")
    
    def test_file_access(self, file_path, description):
        """Test if a file is accessible via HTTP"""
        url = f"{self.base_url}/{file_path}"
        try:
            with urllib.request.urlopen(url, timeout=5) as response:
                if response.status == 200:
                    content_length = len(response.read())
                    print(f"✅ {description}: {content_length} bytes")
                    return True
                else:
                    print(f"❌ {description}: HTTP {response.status}")
                    return False
        except urllib.error.URLError as e:
            print(f"❌ {description}: {e}")
            return False
        except Exception as e:
            print(f"❌ {description}: {e}")
            return False
    
    def test_game_assets(self):
        """Test all game assets are accessible"""
        print("\n🎨 Testing Game Assets:")
        
        # Test main files
        files_to_test = [
            ("", "Main game page (index.html)"),
            ("css/style.css", "Game stylesheet"),
            ("js/game.js", "Game JavaScript"),
        ]
        
        # Test character images
        character_images = [
            "char_engineer.png",
            "char_warrior.png"
        ]
        
        # Test boss images
        boss_images = [
            "boss_spider.png",
            "boss_golem.png",
            "boss_captain.png"
        ]
        
        # Test slot symbol images
        slot_images = [
            "slot_crystal.png",
            "slot_sword.png",
            "slot_shield.png",
            "slot_armor.png",
            "slot_gear.png",
            "slot_pipe.png",
            "slot_potion.png",
            "slot_button.png"
        ]
        
        # Test UI images
        ui_images = [
            "ui_health_bg.png",
            "ui_slot_frame.png",
            "ui_spin_button.png"
        ]
        
        # Add image paths
        for img in character_images + boss_images + slot_images + ui_images:
            files_to_test.append((f"assets/images/{img}", f"Image: {img}"))
        
        success_count = 0
        total_count = len(files_to_test)
        
        for file_path, description in files_to_test:
            if self.test_file_access(file_path, description):
                success_count += 1
        
        print(f"\n📊 Asset Test Results: {success_count}/{total_count} files accessible")
        return success_count == total_count
    
    def test_server_response(self):
        """Test basic server response"""
        print("\n🌐 Testing Server Response:")
        
        try:
            # Wait a moment for server to fully start
            time.sleep(1)
            
            # Test main page
            with urllib.request.urlopen(self.base_url, timeout=10) as response:
                content = response.read().decode('utf-8')
                
                # Check for key game elements
                checks = [
                    ("<!DOCTYPE html>", "HTML5 doctype"),
                    ("Steampunk Slot Machine RPG", "Game title"),
                    ("game-container", "Game container element"),
                    ("css/style.css", "CSS stylesheet link"),
                    ("js/game.js", "JavaScript game file"),
                    ("assets/images/", "Asset references")
                ]
                
                print("🔍 Content Validation:")
                for check, description in checks:
                    if check in content:
                        print(f"  ✅ {description}")
                    else:
                        print(f"  ❌ {description}")
                
                return True
                
        except Exception as e:
            print(f"❌ Server response test failed: {e}")
            return False
    
    def run_full_test(self):
        """Run complete server and game testing"""
        print("🚀 Starting Steampunk Slot Machine RPG Server Test")
        print("=" * 50)
        
        # Start server
        if not self.start_server():
            # Try alternative port
            print(f"Trying alternative port 8080...")
            self.port = 8080
            self.base_url = f"http://localhost:{self.port}"
            if not self.start_server():
                print("❌ Failed to start server on any port")
                return False
        
        try:
            # Test server response
            server_ok = self.test_server_response()
            
            # Test game assets
            assets_ok = self.test_game_assets()
            
            # Final results
            print("\n" + "=" * 50)
            print("📋 FINAL TEST RESULTS:")
            print(f"🌐 Server Status: {'✅ PASS' if server_ok else '❌ FAIL'}")
            print(f"🎨 Assets Status: {'✅ PASS' if assets_ok else '❌ FAIL'}")
            
            if server_ok and assets_ok:
                print(f"\n🎉 SUCCESS! Game is ready to play at: {self.base_url}")
                print("\n📖 Instructions:")
                print(f"1. Keep this script running")
                print(f"2. Open your web browser")
                print(f"3. Navigate to: {self.base_url}")
                print(f"4. Enjoy the Steampunk Slot Machine RPG!")
                print(f"5. Press Ctrl+C to stop the server")
                
                # Keep server running
                try:
                    print("\n⏳ Server running... Press Ctrl+C to stop")
                    while True:
                        time.sleep(1)
                except KeyboardInterrupt:
                    print("\n🛑 Shutting down server...")
                    
            else:
                print("\n❌ FAILED! Please check the issues above")
                
        finally:
            self.stop_server()

def main():
    """Main function to run the server test"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Test Steampunk Slot Machine RPG Server')
    parser.add_argument('--port', type=int, default=8000, help='Port to run server on (default: 8000)')
    parser.add_argument('--test-only', action='store_true', help='Run tests without keeping server running')
    
    args = parser.parse_args()
    
    tester = GameServerTester(args.port)
    
    if args.test_only:
        # Quick test mode
        print("🔬 Running quick server test...")
        if tester.start_server():
            time.sleep(1)
            server_ok = tester.test_server_response()
            assets_ok = tester.test_game_assets()
            tester.stop_server()
            
            if server_ok and assets_ok:
                print("✅ All tests passed! Game is ready for hosting.")
                sys.exit(0)
            else:
                print("❌ Some tests failed. Check the output above.")
                sys.exit(1)
        else:
            print("❌ Failed to start server.")
            sys.exit(1)
    else:
        # Full interactive mode
        tester.run_full_test()

if __name__ == "__main__":
    main()