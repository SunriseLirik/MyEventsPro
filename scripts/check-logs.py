import paramiko

HOST = '161.104.17.172'
USER = 'root'
PASSWORD = 'h9FCQFupBbNgrfzF'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username=USER, password=PASSWORD, timeout=30)

cmds = [
    'ls -la /var/www/myeventspro/',
    'ls -la /var/www/myeventspro/.next/',
    'cat /var/www/myeventspro/server.js | head -20',
]
for cmd in cmds:
    print(f'>>> {cmd}')
    stdin, stdout, stderr = client.exec_command(cmd)
    print(stdout.read().decode('utf-8', errors='replace'))
    print()

client.close()
