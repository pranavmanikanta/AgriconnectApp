document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const DOM = {
      sidebar: document.getElementById('sidebar'),
      toggleBtn: document.getElementById('sidebarToggle'),
      logoutBtn: document.getElementById('logoutBtn'),
      menuItems: document.querySelectorAll('.menu-item:not(.logout)'),
      pages: document.querySelectorAll('.page'),
      globalSearch: document.getElementById('globalSearch'),
      themeSelect: document.getElementById('themeSelect'),
      recentOrdersBody: document.getElementById('recentOrdersBody'),
      ordersBody: document.getElementById('ordersBody'),
      customersBody: document.getElementById('customersBody'),
      inventoryBody: document.getElementById('inventoryBody'),
      reportOutput: document.getElementById('reportOutput'),
    };
  
    // State Management
    const state = {
      productPage: 1,
      orderPage: 1,
      customerPage: 1,
      inventoryPage: 1,
      itemsPerPage: 5,
      theme: localStorage.getItem('theme') || 'light',
      isLoading: false,
    };
  
    // Data Store
    const dataStore = {
      orders: [
        { id: '#5892', customer: 'John Doe', product: 'Organic Tomatoes', qty: 20, status: 'Completed', date: '2025-04-02', total: 126.99, payment: 'Paid (Visa)' },
        { id: '#5891', customer: 'Sarah Miller', product: 'Fresh Lettuce', qty: 5, status: 'Processing', date: '2025-04-02', total: 85.50, payment: 'Pending' },
        { id: '#5890', customer: 'Robert Johnson', product: 'Farm Fresh Eggs', qty: 30, status: 'Shipped', date: '2025-04-01', total: 210.75, payment: 'Paid (MC)' },
        { id: '#5889', customer: 'Emily Clark', product: 'Honey', qty: 2, status: 'Completed', date: '2025-04-01', total: 90.40, payment: 'Paid (PayPal)' },
        { id: '#5888', customer: 'Michael Brown', product: 'Blueberries', qty: 10, status: 'Cancelled', date: '2025-03-31', total: 97.85, payment: 'Refunded' },
        { id: '#5887', customer: 'Lisa White', product: 'Organic Carrots', qty: 15, status: 'Completed', date: '2025-03-30', total: 75.00, payment: 'Paid (Visa)' },
        { id: '#5886', customer: 'David Green', product: 'Milk', qty: 10, status: 'Shipped', date: '2025-03-29', total: 45.00, payment: 'Paid (MC)' },
        { id: '#5885', customer: 'Anna Taylor', product: 'Strawberries', qty: 8, status: 'Processing', date: '2025-03-28', total: 60.80, payment: 'Pending' },
      ],
      inventory: [
        { id: 'I001', product: 'Organic Tomatoes', category: 'Vegetables', stock: 50, lastUpdated: '2025-04-02', supplier: 'Green Fields' },
        { id: 'I002', product: 'Fresh Lettuce', category: 'Vegetables', stock: 30, lastUpdated: '2025-04-02', supplier: 'Leafy Greens' },
        { id: 'I003', product: 'Farm Fresh Eggs', category: 'Dairy', stock: 100, lastUpdated: '2025-04-01', supplier: 'Eggcellent Farms' },
        { id: 'I004', product: 'Honey', category: 'Other', stock: 20, lastUpdated: '2025-04-01', supplier: 'Bee Happy' },
        { id: 'I005', product: 'Blueberries', category: 'Fruits', stock: 40, lastUpdated: '2025-03-31', supplier: 'Berry Bliss' },
        { id: 'I006', product: 'Organic Carrots', category: 'Vegetables', stock: 60, lastUpdated: '2025-03-30', supplier: 'Root Farms' },
        { id: 'I007', product: 'Milk', category: 'Dairy', stock: 25, lastUpdated: '2025-03-29', supplier: 'Dairy Delight' },
        { id: 'I008', product: 'Strawberries', category: 'Fruits', stock: 8, lastUpdated: '2025-03-28', supplier: 'Berry Bliss' },
      ],
      customers: [
        { id: 'C001', name: 'John Doe', email: 'john.doe@example.com', phone: '(555) 123-4567', joinDate: '2023-01-15', totalOrders: 12, totalSpent: 1234.56 },
        { id: 'C002', name: 'Sarah Miller', email: 'sarah.miller@example.com', phone: '(555) 234-5678', joinDate: '2023-06-20', totalOrders: 8, totalSpent: 876.45 },
        { id: 'C003', name: 'Robert Johnson', email: 'robert.j@example.com', phone: '(555) 345-6789', joinDate: '2022-11-10', totalOrders: 15, totalSpent: 2145.78 },
        { id: 'C004', name: 'Emily Clark', email: 'emily.clark@example.com', phone: '(555) 456-7890', joinDate: '2024-02-01', totalOrders: 5, totalSpent: 456.89 },
        { id: 'C005', name: 'Michael Brown', email: 'michael.b@example.com', phone: '(555) 567-8901', joinDate: '2023-03-15', totalOrders: 10, totalSpent: 987.65 },
        { id: 'C006', name: 'Lisa White', email: 'lisa.white@example.com', phone: '(555) 678-9012', joinDate: '2023-08-22', totalOrders: 7, totalSpent: 654.32 },
        { id: 'C007', name: 'David Green', email: 'david.green@example.com', phone: '(555) 789-0123', joinDate: '2022-09-05', totalOrders: 9, totalSpent: 1123.45 },
        { id: 'C008', name: 'Anna Taylor', email: 'anna.taylor@example.com', phone: '(555) 890-1234', joinDate: '2024-01-10', totalOrders: 6, totalSpent: 543.21 },
      ],
    };
  
    // Utility Functions
    const utils = {
      debounce: (func, wait) => {
        let timeout;
        return (...args) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => func(...args), wait);
        };
      },
      formatCurrency: (value) => `$${value.toFixed(2)}`,
      showToast: (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
      },
      setLoading: (isLoading) => {
        state.isLoading = isLoading;
        DOM.pages.forEach(page => page.style.opacity = isLoading ? '0.5' : '1');
      },
    };
  
    // UI Management
    const ui = {
      toggleSidebar: () => DOM.sidebar.classList.toggle('collapsed'),
      logout: () => {
        if (confirm('Are you sure you want to logout?')) {
          utils.showToast('Logging out...', 'success');
          setTimeout(() => window.location.reload(), 1000); // Simulate logout
        }
      },
      switchPage: (pageId) => {
        DOM.menuItems.forEach(i => i.classList.remove('active'));
        DOM.menuItems.forEach(i => i.dataset.page === pageId && i.classList.add('active'));
        DOM.pages.forEach(page => page.classList.remove('active'));
        document.getElementById(`${pageId}-page`).classList.add('active');
      },
      setTheme: (theme) => {
        document.body.classList.toggle('dark-theme', theme === 'dark');
        DOM.themeSelect.value = theme;
        localStorage.setItem('theme', theme);
      },
      renderTable: (tbody, data, template, start, end) => {
        tbody.innerHTML = data.slice(start, end).map(template).join('');
      },
      updatePagination: (elementId, currentPage, totalPages, changePageFunc) => {
        const pageNumbers = document.getElementById(elementId);
        pageNumbers.innerHTML = '';
        const maxPages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
        let endPage = Math.min(totalPages, startPage + maxPages - 1);
        if (endPage - startPage + 1 < maxPages) startPage = Math.max(1, endPage - maxPages + 1);
        for (let i = startPage; i <= endPage; i++) {
          const btn = document.createElement('button');
          btn.textContent = i;
          btn.className = i === currentPage ? 'btn-primary' : '';
          btn.onclick = () => { state[`${elementId.replace('PageNumbers', 'Page')}`] = i; changePageFunc(0); };
          pageNumbers.appendChild(btn);
        }
      },
    };
  
    // Data Handlers
    const dataHandlers = {
      filterAndSort: (data, searchTerm, filterKey, filterValue, sortKey, sortDirection) => {
        let filtered = [...data].filter(item => 
          Object.values(item).some(val => val.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        );
        if (filterKey && filterValue !== 'all') filtered = filtered.filter(item => item[filterKey] === filterValue);
        if (sortKey) {
          filtered.sort((a, b) => {
            if (typeof a[sortKey] === 'number') return sortDirection === 'asc' ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
            return sortDirection === 'asc' ? a[sortKey].localeCompare(b[sortKey]) : b[sortKey].localeCompare(a[sortKey]);
          });
        }
        return filtered;
      },
      ordersTemplate: (order) => `
        <tr data-tooltip="Order placed on ${order.date}">
          <td>${order.id}</td>
          <td>${order.customer}</td>
          <td>${order.product}</td>
          <td>${order.qty}</td>
          <td><span class="status status-${order.status.toLowerCase()}">${order.status}</span></td>
          <td>${order.date}</td>
          <td>${utils.formatCurrency(order.total)}</td>
          <td>${order.payment}</td>
          <td>
            <button class="btn-primary" onclick="viewOrder('${order.id}')">View</button>
            <button class="btn-danger" onclick="cancelOrder('${order.id}')" ${order.status === 'Cancelled' ? 'disabled' : ''}>Cancel</button>
          </td>
        </tr>
      `,
      inventoryTemplate: (item) => `
        <tr>
          <td>${item.id}</td>
          <td>${item.product}</td>
          <td>${item.category}</td>
          <td>${item.stock}</td>
          <td>${item.lastUpdated}</td>
          <td>${item.supplier}</td>
          <td>
            <button class="btn-primary" onclick="updateInventory('${item.id}')">Update</button>
            <button class="btn-danger" onclick="deleteInventory('${item.id}')">Delete</button>
          </td>
        </tr>
      `,
      customersTemplate: (customer) => `
        <tr>
          <td>${customer.id}</td>
          <td>${customer.name}</td>
          <td>${customer.email}</td>
          <td>${customer.phone}</td>
          <td>${customer.joinDate}</td>
          <td>${customer.totalOrders}</td>
          <td>${utils.formatCurrency(customer.totalSpent)}</td>
          <td>
            <button class="btn-primary" onclick="viewCustomer('${customer.id}')">View</button>
            <button class="btn-danger" onclick="deleteCustomer('${customer.id}')">Delete</button>
          </td>
        </tr>
      `,
    };
  
    // Page Controllers
    const controllers = {
      dashboard: {
        displayRecentOrders: () => {
          const recentOrders = dataStore.orders.slice(0, 5);
          ui.renderTable(DOM.recentOrdersBody, recentOrders, dataHandlers.ordersTemplate, 0, 5);
        },
        updateWeather: () => {
          const temps = [68, 70, 72, 74, 76];
          const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'];
          setInterval(() => {
            document.querySelector('.weather-temp').textContent = `${temps[Math.floor(Math.random() * temps.length)]}°F`;
            document.querySelector('.weather-desc').textContent = conditions[Math.floor(Math.random() * conditions.length)];
          }, 60000);
        },
      },
      orders: {
        display: () => {
          const searchTerm = document.getElementById('orderSearch').value;
          const filterStatus = document.getElementById('orderFilter').value;
          const filtered = dataHandlers.filterAndSort(dataStore.orders, searchTerm, 'status', filterStatus);
          const start = (state.orderPage - 1) * state.itemsPerPage;
          const end = start + state.itemsPerPage;
          ui.renderTable(DOM.ordersBody, filtered, dataHandlers.ordersTemplate, start, end);
          ui.updatePagination('orderPageNumbers', state.orderPage, Math.ceil(filtered.length / state.itemsPerPage), controllers.orders.changePage);
        },
        changePage: (direction) => {
          state.orderPage = Math.max(1, Math.min(Math.ceil(dataStore.orders.length / state.itemsPerPage), state.orderPage + direction));
          controllers.orders.display();
        },
      },
      customers: {
        display: () => {
          const searchTerm = document.getElementById('customerSearch').value;
          const sortBy = document.getElementById('customerSort').value;
          const sortKey = sortBy === 'name' ? 'name' : sortBy === 'orders' ? 'totalOrders' : 'joinDate';
          const filtered = dataHandlers.filterAndSort(dataStore.customers, searchTerm, null, 'all', sortKey, 'asc');
          const start = (state.customerPage - 1) * state.itemsPerPage;
          const end = start + state.itemsPerPage;
          ui.renderTable(DOM.customersBody, filtered, dataHandlers.customersTemplate, start, end);
          ui.updatePagination('customerPageNumbers', state.customerPage, Math.ceil(filtered.length / state.itemsPerPage), controllers.customers.changePage);
        },
        changePage: (direction) => {
          state.customerPage = Math.max(1, Math.min(Math.ceil(dataStore.customers.length / state.itemsPerPage), state.customerPage + direction));
          controllers.customers.display();
        },
      },
      inventory: {
        display: () => {
          const searchTerm = document.getElementById('inventorySearch').value;
          const filterStock = document.getElementById('inventoryFilter').value;
          let filtered = dataHandlers.filterAndSort(dataStore.inventory, searchTerm);
          if (filterStock !== 'all') {
            filtered = filtered.filter(i => {
              if (filterStock === 'low') return i.stock < 10;
              if (filterStock === 'medium') return i.stock >= 10 && i.stock <= 50;
              return i.stock > 50;
            });
          }
          const start = (state.inventoryPage - 1) * state.itemsPerPage;
          const end = start + state.itemsPerPage;
          ui.renderTable(DOM.inventoryBody, filtered, dataHandlers.inventoryTemplate, start, end);
          ui.updatePagination('inventoryPageNumbers', state.inventoryPage, Math.ceil(filtered.length / state.itemsPerPage), controllers.inventory.changePage);
        },
        changePage: (direction) => {
          state.inventoryPage = Math.max(1, Math.min(Math.ceil(dataStore.inventory.length / state.itemsPerPage), state.inventoryPage + direction));
          controllers.inventory.display();
        },
      },
      reports: {
        generate: () => {
          try {
            const type = document.getElementById('reportType').value;
            const date = document.getElementById('reportDate').value;
            const period = document.getElementById('reportPeriod').value;
            let output = '';
            switch (type) {
              case 'sales':
                output = `Sales Report (${period} - ${date}): Total Sales: ${utils.formatCurrency(dataStore.orders.reduce((sum, o) => sum + o.total, 0))}`;
                break;
              case 'orders':
                output = `Orders Report (${period} - ${date}): Total Orders: ${dataStore.orders.length}`;
                break;
              case 'inventory':
                output = `Inventory Report (${period} - ${date}): Total Stock: ${dataStore.inventory.reduce((sum, i) => sum + i.stock, 0)}`;
                break;
              case 'customers':
                output = `Customer Report (${period} - ${date}): Total Customers: ${dataStore.customers.length}`;
                break;
              default:
                output = `${type.charAt(0).toUpperCase() + type.slice(1)} Report (${period} - ${date}): Data not fully implemented.`;
            }
            DOM.reportOutput.innerHTML = `<p>${output}</p>`;
            utils.showToast('Report generated successfully!', 'success');
          } catch (error) {
            utils.showToast('Error generating report', 'error');
            console.error(error);
          }
        },
      },
    };
  
    // Action Handlers
    const actions = {
      viewOrder: (id) => utils.showToast(`Viewing Order ${id}`, 'info'),
      cancelOrder: (id) => {
        if (confirm(`Cancel Order ${id}?`)) {
          const order = dataStore.orders.find(o => o.id === id);
          order.status = 'Cancelled';
          controllers.orders.display();
          controllers.dashboard.displayRecentOrders();
          utils.showToast(`Order ${id} cancelled`, 'success');
        }
      },
      viewCustomer: (id) => utils.showToast(`Viewing Customer ${id}`, 'info'),
      deleteCustomer: (id) => {
        if (confirm(`Delete Customer ${id}?`)) {
          dataStore.customers.splice(dataStore.customers.findIndex(c => c.id === id), 1);
          controllers.customers.display();
          utils.showToast(`Customer ${id} deleted`, 'success');
        }
      },
      updateInventory: (id) => {
        const newStock = prompt(`Update stock for ${id}:`, dataStore.inventory.find(i => i.id === id).stock);
        if (newStock !== null) {
          dataStore.inventory.find(i => i.id === id).stock = parseInt(newStock) || 0;
          controllers.inventory.display();
          utils.showToast(`Inventory ${id} updated`, 'success');
        }
      },
      deleteInventory: (id) => {
        if (confirm(`Delete Inventory ${id}?`)) {
          dataStore.inventory.splice(dataStore.inventory.findIndex(i => i.id === id), 1);
          controllers.inventory.display();
          utils.showToast(`Inventory ${id} deleted`, 'success');
        }
      },
      saveSettings: () => {
        utils.showToast('Settings saved successfully', 'success');
      },
      switchToOrdersPage: () => ui.switchPage('orders'),
    };
  
    // Event Listeners
    DOM.toggleBtn.addEventListener('click', ui.toggleSidebar);
    DOM.logoutBtn.addEventListener('click', ui.logout);
    DOM.menuItems.forEach(item => item.addEventListener('click', () => ui.switchPage(item.dataset.page)));
    DOM.themeSelect.addEventListener('change', (e) => ui.setTheme(e.target.value));
    DOM.globalSearch.addEventListener('input', utils.debounce(() => {
      controllers.orders.display();
      controllers.customers.display();
      controllers.inventory.display();
    }, 300));
    document.getElementById('orderSearch').addEventListener('input', utils.debounce(controllers.orders.display, 300));
    document.getElementById('orderFilter').addEventListener('change', controllers.orders.display);
    document.getElementById('customerSearch').addEventListener('input', utils.debounce(controllers.customers.display, 300));
    document.getElementById('customerSort').addEventListener('change', controllers.customers.display);
    document.getElementById('inventorySearch').addEventListener('input', utils.debounce(controllers.inventory.display, 300));
    document.getElementById('inventoryFilter').addEventListener('change', controllers.inventory.display);
  
    // Table Sorting
    const addSortListeners = (tableId, displayFunc) => {
      document.querySelectorAll(`#${tableId} th.sortable`).forEach(th => {
        th.addEventListener('click', () => {
          const sortKey = th.dataset.sort;
          const currentDirection = th.classList.contains('asc') ? 'desc' : 'asc';
          document.querySelectorAll(`#${tableId} th.sortable`).forEach(t => t.classList.remove('asc', 'desc'));
          th.classList.add(currentDirection);
          dataHandlers.filterAndSort[dataStore[tableId.replace('Table', '')]] = { sortKey, sortDirection: currentDirection };
          displayFunc();
        });
      });
    };
    addSortListeners('recentOrdersTable', controllers.dashboard.displayRecentOrders);
    addSortListeners('ordersTable', controllers.orders.display);
    addSortListeners('customersTable', controllers.customers.display);
    addSortListeners('inventoryTable', controllers.inventory.display);
  
    // Initial Setup
    ui.setTheme(state.theme);
    controllers.dashboard.displayRecentOrders();
    controllers.orders.display();
    controllers.customers.display();
    controllers.inventory.display();
    controllers.dashboard.updateWeather();
    controllers.reports.generate();
  
    // Expose Global Functions
    Object.assign(window, actions, {
      generateReport: controllers.reports.generate,
      changeOrderPage: controllers.orders.changePage,
      changeCustomerPage: controllers.customers.changePage,
      changeInventoryPage: controllers.inventory.changePage,
      switchToOrdersPage: actions.switchToOrdersPage,
    });
  });
  
  // CSS for Toast Notifications (add to your styles.css)
  const toastStyles = `
    .toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 10px 20px;
      border-radius: 8px;
      color: #fff;
      z-index: 1000;
      transition: opacity 0.3s ease;
    }
    .toast-info { background-color: #3498DB; }
    .toast-success { background-color: #27AE60; }
    .toast-error { background-color: #E74C3C; }
  `;
  document.head.insertAdjacentHTML('beforeend', `<style>${toastStyles}</style>`); 