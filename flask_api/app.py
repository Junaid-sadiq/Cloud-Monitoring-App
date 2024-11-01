from flask import Flask, jsonify
from flask_cors import CORS
import psutil
import platform

app = Flask(__name__)
CORS(app)  

@app.route('/metrics', methods=['GET'])
def get_metrics():
    cpu_times = psutil.cpu_times()
    virtual_memory = psutil.virtual_memory()
    swap_memory = psutil.swap_memory()
    disk_usage = psutil.disk_usage('/')
    net_io = psutil.net_io_counters()

    metrics = {
        'cpu_usage': psutil.cpu_percent(interval=0.1, percpu=False),  # Overall CPU usage
        'cpu_freq': psutil.cpu_freq().current,
        'cpu_type': platform.processor(),
        'cpu_times': {
            'user': cpu_times.user,
            'system': cpu_times.system,
            'idle': cpu_times.idle,
            'interrupt': getattr(cpu_times, 'interrupt', None), 
            'dpc': getattr(cpu_times, 'dpc', None)  
        },
        'ram_usage': virtual_memory.percent,
        'ram_total': virtual_memory.total,
        'ram_available': virtual_memory.available,
        'swap_usage': swap_memory.percent,
        'swap_total': swap_memory.total,
        'swap_free': swap_memory.free,
        'disk_usage': {
            'total': disk_usage.total,
            'used': disk_usage.used,
            'free': disk_usage.free,
            'percent': disk_usage.percent
        },
        'network_io': {
            'bytes_sent': net_io.bytes_sent,
            'bytes_recv': net_io.bytes_recv,
            'packets_sent': net_io.packets_sent,
            'packets_recv': net_io.packets_recv
        }
    }
    return jsonify(metrics)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)