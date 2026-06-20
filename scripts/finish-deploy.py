import paramiko

HOST = '161.104.17.172'
USER = 'root'
PASSWORD = 'h9FCQFupBbNgrfzF'
REMOTE_DIR = '/var/www/myeventspro'

def run(client, cmd):
    print(f'>>> {cmd}')
    stdin, stdout, stderr = client.exec_command(cmd, get_pty=True)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    print(out)
    if err.strip():
        print('ERR:', err)
    rc = stdout.channel.recv_exit_status()
    if rc != 0:
        raise RuntimeError(f'Command failed with {rc}: {cmd}\n{err}')
    return out

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username=USER, password=PASSWORD, timeout=30)

print('Creating production .env...')
env_content = '''DATABASE_URL="file:/var/www/myeventspro/dev.db"
JWT_SECRET="myeventspro-jwt-secret-2026-production"
NEXTAUTH_SECRET="myeventspro-secret-key-2026-production"
NEXTAUTH_URL="https://myeventspro.ru"
NODE_ENV="production"
'''
with open('.env.production.tmp', 'w', encoding='utf-8') as f:
    f.write(env_content)
client.open_sftp().put('.env.production.tmp', f'{REMOTE_DIR}/.env')
import os
os.remove('.env.production.tmp')

print('Generating Prisma Client...')
run(client, f'cd {REMOTE_DIR} && npx prisma generate')

print('Running migrations...')
run(client, f'cd {REMOTE_DIR} && npx prisma migrate deploy')

print('Seeding database...')
run(client, f'cd {REMOTE_DIR} && npx tsx prisma/seed.ts')

print('Starting with pm2...')
run(client, f'cd {REMOTE_DIR} && pm2 delete myeventspro 2>/dev/null || true')
run(client, f'cd {REMOTE_DIR} && PORT=3001 pm2 start server.js --name myeventspro')
run(client, 'pm2 save')

print('Reloading nginx...')
run(client, 'nginx -t && systemctl reload nginx')

print('Obtaining SSL certificate...')
run(client, 'certbot --nginx -d myeventspro.ru -d www.myeventspro.ru --non-interactive --agree-tos -m admin@myeventspro.ru --redirect')

print('Reloading nginx after SSL...')
run(client, 'systemctl reload nginx')

print('Done!')
client.close()
