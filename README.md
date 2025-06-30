# 🎯 TrafiBoard

TrafiBoard is a dynamic `Reverse-Proxy-to-Dashboard` application capable of aggregating multiple Reverse Proxies, parsing their API data and generating a unified dashboard that is always up to date with your infrastructure! 

No more bookmarks or manually managed dashboards with broken links!

Do you use Traefik or Nginx Proxy Manager as reverse proxy for your Docker containers or Infrastructrue?

If so then give TrafiBoard a spin and let it automagically generate a dashboard with an index of your services and hosts.

## 📸 Demo

[TBD]

## 🌟 Features
1. 🍱 Supports indexing and aggregating of multiple reverse-proxies into a unified view
1. 🧩 Supports indexing of Reverse Proxies:
   1. [Traefik](https://traefik.io/traefik/)
   1. [Nginx Proxy Manager](https://nginxproxymanager.com)
1. 👯 Toggleable deduplication of routes that are common across hosts
2. 🎯 Search bar to find your services even faster!
3. ⚙️ Dead simple to setup and maintain:
   1. Configure the URLs to the APIs of your proxies
   2. TrafiBoard will figure out the type of proxy and how to extract its information.
4. 🐳 Docker deployment 
5. 💨 Stateless. No volumes to mount. No file permissions to deal with.

---

## 📦 Deployment

### 🐳 Docker Run
```bash
docker run -p 8080:8080 --name traefiboard \ 
  -e '[{"url":"https://traefik.instance1.com","username":"","password":""},{"url":"http://192.168.0.1","username":"","password":""},{"url":"https://nginx.instance3.com","username":"","password":""}]' \
  ghcr.io/bartoszkaszewczuk/trafiboard:latest
```

### 🐳 Docker Compose
```yaml
services:
  trafiboard:
    image: ghcr.io/bartoszkaszewczuk/trafiboard:latest
    ports:
      - 8080:8080
    environment:
      TB_PAGE_TITLE: "TrafiBoard Apps"
      TB_HOSTS: >
        [
          {
            "url": "https://traefik.instance1.com",
            "username": "",
            "password": ""
          },
          {
            "url": "http://192.168.0.1",
            "username": "",
            "password": ""
          },
          {
            "url": "https://nginx.instance3.com",
            "username": "",
            "password": ""
          }
        ]
```
---

## ⚠️ Current Limitations
1. Only unprotected API access to Traefik is currently supported. We recommend setting up communication over a private network.
2. Currently only services defining `favicon.ico` at the root will display a favicon beside service name.

---

## 💬 FAQ

1. How to add a static entry/route to TrafiBoard?
   1. Static routes can be added by declaring them in Nginx Proxy Manager UI or in a `file-provider.yaml` incase of Traefik.


## 🧑‍💻 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 🪪 License

[BSD-3 Clause](LICENSE)

