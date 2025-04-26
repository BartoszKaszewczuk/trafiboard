# 💡🐳 TrafiBoard

TrafiBoard is a dynamic `Reverse-Proxy-to-Dashboard` application capable of aggregating multiple Reverse Proxies, parsing their data and generating a unified dashboard that is always up to date with your infrastructure! 

No more bookmarks or manually managed dashboards with broken links!

Do you use Traefik as reverse proxy for your Docker containers or Nginx Proxy Manager?

If so then TrafiBoard may be just the tool for you.

TrafiBoard automagically generates a dashboard/index of services from reverse proxies (even multiple).

## 📸 Demo

Include screenshots, GIFs, or a link to a live demo if available.

## 🌟 Features
1. 🍱 Capable of indexing multiple proxies and aggregating their routes/services into a unified view
1. 🧩 Supports indexing of Reverse Proxies:
   1. [Traefik](https://traefik.io/traefik/)
   1. [Nginx Proxy Manager](https://nginxproxymanager.com)
1. 👯 Toggleable deduplication of routes that are common across hosts
2. 🎯 Search bar to find your services even faster!
3. ⚙️ Dead simple to setup and maintain 
   4. Just configure the URLs to your proxies and TrafiBoard will figure out the type of proxy and how to extract its information.
4. 🐳 Docker deployment. Fast and simple.
4. 💨 Stateless. No volumes to mount. No file permissions to deal with.

---

## 📦 Deployment

### 🐳 Docker Run
```bash
# Clone the repository
git clone https://github.com/your-username/your-project-name.git

# Go into the project directory
cd your-project-name

# Install dependencies
npm install

# Run the app
npm start
```

### 🐳 Docker Compose
```yaml
services:
  trafiboard:
    build:
      context: .
      dockerfile: Dockerfile
    image: //TODO TBD
    ports:
      - 8080:8080
    environment:
      TRAFI_TITLE: "TrafiBoard Apps"
      TRAFI_TRAEFIK_HOSTS: >
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

Q: How to add a static entry/route to TrafiBoard?

A: Just declare it in Nginx Proxy Manager UI or in a `file-provider.yaml` incase of Traefik.


## 🧑‍💻 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 🪪 License

TBD

