#!/usr/bin/env python
# Note: this file derived from https://gist.github.com/rca/4063325

import SimpleHTTPServer
 
class MyHTTPRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_my_headers()
        SimpleHTTPServer.SimpleHTTPRequestHandler.end_headers(self)
 
    def send_my_headers(self):
#       self.send_header("Access-Control-Allow-Origin", "http://earthquake.usgs.gov")
#       self.send_header("Access-Control-Allow-Origin", "http://localhost")
#       self.send_header("Access-Control-Allow-Origin", "http://localhost:8000")
        self.send_header("Access-Control-Allow-Origin", "*")
 

if __name__ == '__main__':
    print "webserver..."
    SimpleHTTPServer.test(HandlerClass=MyHTTPRequestHandler)

