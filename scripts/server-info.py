import paramiko

HOST = '161.104.17.172'
USER = 'root'
PASSWORD = 'h9FCQFupBbNgrfzF'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username=USER, password=PASSWORD, timeout=30)

cmds = [
    'ls -la /var/www/myeventspro/',
    'ls /var/www/myeventspro/node_modules/@prisma/client/generator-build/ 2>/dev/null && echo OK || echo MISSING',
    'ls /var/www/myeventspro/node_modules/.bin/prisma 2>/dev/null && echo PRISMA_OK || echo PRISMA_MISSING',
]
for cmd in cmds:
    print(f'>>> {cmd}')
    stdin, stdout, stderr = client.exec_command(cmd)
    print(stdout.read().decode('utf-8', errors='replace'))
    print()

client.close()
