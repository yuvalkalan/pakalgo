import subprocess
import multiprocessing
import os
import time


def run_command(command, directory='./'):
    os.chdir(directory)
    proc = subprocess.Popen(command, stdout=subprocess.PIPE, shell=True)
    while True:
        line = proc.stdout.readline()
        if not line:
            break
        print(line.rstrip().decode('utf-8'))


def backend_worker():
    run_command(['python', 'server.py'], directory='./server')


def frontend_worker():
    run_command(['npm', 'i'])
    run_command(['npm', 'run', 'dev'])


def main():
    backend_process = multiprocessing.Process(target=backend_worker)
    backend_process.start()
    frontend_process = multiprocessing.Process(target=frontend_worker)
    frontend_process.start()
    while True:
        time.sleep(1)


if __name__ == '__main__':
    main()