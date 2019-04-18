FROM node:carbon

# Add Entrypoint
COPY ./docker/entrypoint.sh /entrypoint/

RUN ["chmod", "+x", "entrypoint/entrypoint.sh"]

# Add WAIT
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait

RUN chmod +x /wait

# Copy or mount node app here
WORKDIR /data/

EXPOSE 8081

ENTRYPOINT ["/entrypoint/entrypoint.sh"]

CMD /wait && npm start

