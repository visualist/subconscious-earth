
#$LOAD_PATH.unshift File.expand_path(".")

require 'rubygems'
require 'bundler'
require 'json'
Bundler.require

require 'sinatra'
require 'open-uri'

enable :logging


not_found do
  api_response 404, "not found"
end

get '/' do
  File.read(File.join('public', 'index.html'))
end

get '/version' do
  1.to_json
end

get '/proxy' do
  url = params[:url]
  raise "GTFO" if (url[0] == '/' || url[0] == '.')
  open(url) do |content|
    content_type content.content_type
    content.read.to_s.gsub(/(href|src)=("|')\//, '\1=\2' + url + '/')
  end
end
