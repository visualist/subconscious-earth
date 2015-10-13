
@dir = File.absolute_path('.')

worker_processes 2
working_directory @dir
timeout 180

#listen File.join(@dir, "tmp/sockets/unicorn.sock"), backlog: 64
listen 4000, backlog: 64

pid File.join(@dir, "tmp/pids/unicorn.pid")
stderr_path File.join(@dir, "log/unicorn.stderr.log")
stdout_path File.join(@dir, "log/unicorn.stdout.log")
