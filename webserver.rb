
require 'rubygems'
require 'bundler'
require 'json'
Bundler.require

require 'sinatra'
require 'open-uri'

enable :logging


class UrlCache
  attr_reader :url, :file, :basename, :extension, :path

  # NOTE: no cache invalidation exists yet!
  def initialize(url)
    @url = url
    @file = url.split('/')[-1]
    @basename, @extension = @file.split('.')
    resource = @file # for now, based on just the file name
    @path = File.join('cache', resource)
  end

  def exists?
    File.exists?(@path)
  end

  def path
    return @path if exists?
    File.join('cache', 'emptyfile')
  end

  def write(content)
    File.open(@path, 'w') { |f| f.write(content) }
  end
end


not_found do
  api_response 404, "not found"
end

get '/' do
  File.read(File.join('public', 'index.html'))
end

get '/version' do
  1.to_json
end

get '/proxydata' do
  url = params[:url]
  raise "Bad URL" if (url[0] == '/' || url[0] == '.')
  cache = UrlCache.new(url)
  begin
    file_response = open(url) do |content|
      content_type content.content_type
      content.read.to_s.gsub(/(href|src)=("|')\//, '\1=\2' + url + '/')
    end
    cache.write(file_response) # save for next time, just in case
    file_response
  rescue
    File.read(cache.path) # read cache only if error occurs
  end
end

get '/proxyimage' do
  url = params[:url]
  raise "Bad URL" if (url[0] == '/' || url[0] == '.')

  cache = UrlCache.new(url)
  if cache.exists?
    # TODO: content_type
    content_type 'image/jpeg' if cache.extension =~ /jp(e)?g/i
    File.read(cache.path) if cache.exists?
  else
    begin
      file_response = open(url) do |content|
        content_type content.content_type
        content.read.to_s.gsub(/(href|src)=("|')\//, '\1=\2' + url + '/')
      end
      # TODO: save content_type
      cache.write(file_response)
      file_response
    rescue
      #File.read(cache.path)
      puts "ERROR: could not get Flickr URL: #{url}"
    end
  end
end
