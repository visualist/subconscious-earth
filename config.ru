$LOAD_PATH.unshift File.expand_path(".")

root = ::File.dirname(__FILE__)

require 'logger'
class ::Logger; alias_method :write, :<<; end
logger = Logger.new('web.log')

use Rack::CommonLogger, logger
require ::File.join(root, 'webserver')

run Sinatra::Application
