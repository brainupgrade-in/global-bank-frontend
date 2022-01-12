FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY ./ /usr/share/nginx/html

# rm -rf dist &&  npm run build && cp nginx-multi.conf dist/nginx.conf && cd dist && docker build -f ../Dockerfile -t localhost:32000/brainupgrade/global-bank-frontend:1.0.0 -t brainupgrade/global-bank-frontend:1.0.0 . && docker push brainupgrade/global-bank-frontend:1.0.0 && docker push localhost:32000/brainupgrade/global-bank-frontend:1.0.0
