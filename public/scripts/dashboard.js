function initializeCharts() {
    updateCharts();
    initializeTableSorting();
    initializeSearch();
}

function updateCharts() {
    const devices = Array.from(document.querySelectorAll('#deviceTable tbody tr:not(.device-group-header)'));
    updateChart('osChart', 'Operating Systems', aggregateDeviceData(devices, 'operatingSystem'));
    updateChart('networkChart', 'Networks', aggregateDeviceData(devices, 'network'));
    updateChart('roleChart', 'System Roles', aggregateDeviceData(devices, 'systemRole'));
    updateChart('hypervisorChart', 'Hypervisors', aggregateDeviceData(devices, 'hypervisorInstalledOn'));
}

function aggregateDeviceData(devices, field) {
    const counts = {};
    devices.forEach(device => {
        const value = device.dataset[field] || 'Unknown';
        counts[value] = (counts[value] || 0) + 1;
    });
    return {
        labels: Object.keys(counts),
        data: Object.values(counts)
    };
}

function initializeTableSorting() {
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', () => sortTable(th));
    });
}

function initializeSearch() {
    const searchInput = document.getElementById('deviceSearch');
    if (searchInput) {
        searchInput.addEventListener('input', filterDevices);
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', initializeCharts);
