import paramiko

HOST = '161.104.17.172'
USER = 'root'
PASSWORD = 'h9FCQFupBbNgrfzF'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    client.connect(HOST, username=USER, password=PASSWORD, timeout=30)
    stdin, stdout, stderr = client.exec_command('hostname && whoami && cat /etc/os-release | head -3')
    print('OK')
    print(stdout.read().decode())
    err = stderr.read().decode()
    if err:
        print('ERR:', err)
except Exception as e:
    print('FAIL:', type(e).__name__, e)
finally:
    client.close()
