worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include mime.types;
    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       8080;
        server_name  localhost;
        include mime.types;

        access_log PROJECT_DIR/devserver/server.log combined;

        # Redirect the root to /artbook
        rewrite ^/$ /artbook permanent;

        location /artbook {
          autoindex on;
          alias   PROJECT_DIR/build;
          index  index.html;
        }

       location = /artbook/a {
         alias   PROJECT_DIR/build;
         index  index.html;
       }

       location ~* /artbook/a/.*$ {
         alias   PROJECT_DIR/build;
         index  index.html;
       }
    }
}
