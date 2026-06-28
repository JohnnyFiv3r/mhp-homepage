# Host Requirements

## Minimum

- Linux host with Docker + Docker Compose.
- 2GB RAM minimum per Twenty docs.
- 20GB+ disk to start; more once backups and attachments accumulate.
- Public DNS for `crm.murfreesborohomepros.com`.
- HTTPS via Caddy, Nginx+Certbot, or equivalent.

## Preferred

- 4GB RAM.
- Automated OS security updates.
- UFW/firewall enabled.
- SSH key-only login.
- External backup target for `/var/backups/mhp-twenty`.
- Monitoring for disk, container health, and backup freshness.

## Open decision needed later

Pick the actual target host:

- existing OpenClaw node/VPS;
- new small VPS;
- home lab with tunnel/reverse proxy;
- other managed Docker host.

Do not expose CRM production data from an unreliable home network unless backups and remote access are solid.
