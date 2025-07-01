<p align="center">
   <img src="public/favicon.ico" alt="TrafiBoard icon" height="128"/>
</p>
<h1 align="center">
   TrafiBoard
</h1>

TrafiBoard is a dynamic `Reverse-Proxy-to-Dashboard` application capable of aggregating multiple Reverse Proxies, parsing their API data and generating a unified dashboard that is always up to date with your infrastructure! 

No more bookmarks or manually managed dashboards with broken links!

Do you use Traefik or Nginx Proxy Manager as reverse proxy for your Docker containers or Infrastructure?

If so then give TrafiBoard a spin and let it automagically generate a dashboard with an index of your services and hosts.

![demo.gif](public/demo.gif)

## 🌟 Features
1. 🧩 Supports indexing of following Reverse Proxies:
   1. [Traefik](https://traefik.io/traefik/)
      1. via unauthenticated API
   2. [Nginx Proxy Manager](https://nginxproxymanager.com)
      1. via authenticated API
2. 🍱 Supports indexing and aggregating of multiple reverse-proxies into a unified view
3. 👯 Toggleable deduplication of routes that are common across hosts
4. 🔍 Search bar to find your services even faster!
5. ⚙️ Simple to setup and maintain:
   1. Configure the URLs to the APIs of your proxies
   2. TrafiBoard will figure out the type of proxy and how to extract its information.
6. 🐳 Docker deployment 
7. 💨 Stateless. No volumes to mount. No file permissions to deal with.

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

## 👍🏻 Considerations
1. TrafiBoard does not tunnel the traffic. Destinations should already be accessible to the client.
2. Only unprotected API access to Traefik is currently supported. We recommend setting up communication over a private network.
3. Currently only services defining `favicon.ico` at the root will display a favicon beside service name.
4. Traefik supports complex routing rules but TrafiBoard currently has only naive support for them and as a result some routes discovered may appear broken.

---

## 💬 FAQ

1. How to add a static entry/route to TrafiBoard?
   1. Static routes can be added by declaring them in Nginx Proxy Manager UI or in a `file-provider.yaml` incase of Traefik.


## 🧑‍💻 About

I'm a solo developer and I kicked off TrafiBoard because I wanted to have an always up to date index with all of my services and frankly I was growing tired of having to manually manage bashboards and links pointing to my ever changing selfhosted services.

TrafiBoard solves it by surfacing active routes to Docker services registered with Traefik; and with Nginx Proxy Manager support aggregating static services is a breeze too.  

If you like the idea, the project has helped you, or saved you time, I'd greatly appreciate your support with a pull request or maybe even a donation.

## 💰 Support

You can support financially through the following platforms:

| Platform                                         | Description                                   | Link                                                                                                                                                                                                                  |
|--------------------------------------------------|-----------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Ko-fi.com](https://ko-fi.com/bartoszkaszewczuk) | Support with one-time or monthly donations 💛 | <a href='https://ko-fi.com/bartoszkaszewczuk' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi1.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a> |


Your contributions help cover development time, maintenance, and motivates me for continued improvements.

Every contribution, no matter the size, makes a difference. **Thank you for your support!**


## 🪪 License

[BSD-3 Clause](LICENSE)

