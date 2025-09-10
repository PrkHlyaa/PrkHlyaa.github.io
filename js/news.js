// News Page Functionality
$(document).ready(function(){
    // Load news data
    function loadNewsData() {
        $('#loadingSpinner').show();
        $('#newsGrid').hide();
        $('#noResults').hide();
        
        $.getJSON("headline.json", function(data){
            $('#loadingSpinner').hide();
            
            if (data && data.length > 0) {
                renderNewsCards(data);
                populateCategories(data);
                renderTableData(data);
                $('#newsGrid').show();
            } else {
                $('#noResults').show();
            }
        }).fail(function(){
            $('#loadingSpinner').hide();
            $('#noResults').show();
            $('#noResults h3').text('Gagal memuat data');
            $('#noResults p').text('Terjadi kesalahan saat mengambil data berita.');
        });
    }
    
    // Render news cards
    function renderNewsCards(newsData) {
        const newsGrid = $('#newsGrid');
        newsGrid.empty();
        
        newsData.forEach(item => {
            const newsCard = `
                <div class="news-card" data-category="${item.kategori}">
                    <div class="news-image">
                        <i class="fas fa-newspaper"></i>
                    </div>
                    <div class="news-content">
                        <span class="news-category">${item.kategori}</span>
                        <h3 class="news-title">
                            <a href="${item.url}" target="_blank">${item.judul}</a>
                        </h3>
                        <div class="news-meta">
                            <span><i class="far fa-calendar-alt"></i> ${item.waktu_publish}</span>
                            <span><i class="far fa-clock"></i> ${item.waktu_scraping}</span>
                        </div>
                    </div>
                </div>
            `;
            newsGrid.append(newsCard);
        });
    }
    
    // Populate categories filter
    function populateCategories(newsData) {
        const categories = [...new Set(newsData.map(item => item.kategori))];
        const categoryFilter = $('#categoryFilter');
        
        // Clear existing options except the first one
        categoryFilter.find('option:not(:first)').remove();
        
        // Add categories to filter
        categories.forEach(category => {
            categoryFilter.append(`<option value="${category}">${category}</option>`);
        });
    }
    
    // Render table data
    function renderTableData(newsData) {
        const tableBody = $('#jsonTable tbody');
        tableBody.empty();
        
        newsData.forEach(item => {
            const row = `
                <tr>
                    <td><a href="${item.url}" target="_blank">${item.judul}</a></td>
                    <td>${item.kategori}</td>
                    <td>${item.waktu_publish}</td>
                    <td>${item.waktu_scraping}</td>
                </tr>
            `;
            tableBody.append(row);
        });
    }
    
    // Search functionality
    $('#searchInput').on('keyup', function() {
        const searchText = $(this).val().toLowerCase();
        const selectedCategory = $('#categoryFilter').val();
        
        filterNews(searchText, selectedCategory);
    });
    
    // Category filter functionality
    $('#categoryFilter').on('change', function() {
        const selectedCategory = $(this).val();
        const searchText = $('#searchInput').val().toLowerCase();
        
        filterNews(searchText, selectedCategory);
    });
    
    // Filter news based on search text and category
    function filterNews(searchText, category) {
        $('.news-card').each(function() {
            const card = $(this);
            const title = card.find('.news-title').text().toLowerCase();
            const cardCategory = card.data('category');
            
            const matchesSearch = searchText === '' || title.includes(searchText);
            const matchesCategory = category === '' || cardCategory === category;
            
            if (matchesSearch && matchesCategory) {
                card.show();
            } else {
                card.hide();
            }
        });
        
        // Show no results message if all cards are hidden
        if ($('.news-card:visible').length === 0) {
            $('#noResults').show();
        } else {
            $('#noResults').hide();
        }
    }
    
    // Sort functionality
    let sortAscending = true;
    $('#sortDateBtn').on('click', function() {
        // This would need actual date parsing for proper sorting
        // For now, we'll just toggle a class for visual feedback
        $(this).toggleClass('sorted', sortAscending);
        sortAscending = !sortAscending;
        
        // In a real implementation, you would sort the data and re-render
        alert('Fungsi pengurutan akan diimplementasi dengan parsing tanggal yang tepat');
    });
    
    // Toggle view between cards and table
    $('#toggleViewBtn').on('click', function() {
        const tableSection = $('.table-section');
        const newsContainer = $('.news-container');
        
        if (tableSection.is(':visible')) {
            tableSection.hide();
            newsContainer.show();
            $(this).html('<i class="fas fa-table"></i> Tampilkan Tabel');
        } else {
            tableSection.show();
            newsContainer.hide();
            $(this).html('<i class="fas fa-th"></i> Tampilkan Kartu');
        }
    });
    
    // Table sorting (basic implementation)
    $('#jsonTable th').on('click', function() {
        const column = $(this).index();
        const rows = $('#jsonTable tbody tr').get();
        
        rows.sort(function(a, b) {
            const aValue = $(a).find('td').eq(column).text();
            const bValue = $(b).find('td').eq(column).text();
            
            return aValue.localeCompare(bValue);
        });
        
        $.each(rows, function(index, row) {
            $('#jsonTable tbody').append(row);
        });
    });
    
    // Initialize page
    loadNewsData();
    
    // Back to top button
    const backToTopButton = $('#backToTop');
    
    $(window).scroll(function() {
        if ($(window).scrollTop() > 300) {
            backToTopButton.addClass('show');
        } else {
            backToTopButton.removeClass('show');
        }
    });
    
    backToTopButton.on('click', function() {
        $('html, body').animate({scrollTop: 0}, 800);
    });
    
    // Mobile menu toggle
    $('.menu-toggle input').on('click', function() {
        $('.nav-links').toggleClass('active');
    });
    
    // Close mobile menu when clicking on a link
    $('.nav-links a').on('click', function() {
        $('.nav-links').removeClass('active');
        $('.menu-toggle input').prop('checked', false);
    });
});
