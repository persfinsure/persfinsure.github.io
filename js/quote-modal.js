/*
 * Quote Modal - Popup contact form that submits to Google Sheets
 * Include this script on any page, then use data-bs-toggle="modal" data-bs-target="#quoteModal"
 * or call openQuoteModal() to trigger.
 */
(function() {
    var GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbznvznDq5BrSqlAdFgJpBOm8Wbuzy8-kJ1MWx14Ol-K7QAiz_16xmnsqsr5EsgNnOp1Yg/exec';

    // Inject modal HTML into the page
    var modalHTML = ''
    + '<div class="modal fade" id="quoteModal" tabindex="-1" aria-labelledby="quoteModalLabel" aria-hidden="true">'
    + '  <div class="modal-dialog modal-dialog-centered">'
    + '    <div class="modal-content" style="border-radius:16px;border:none;">'
    + '      <div class="modal-header border-0 pb-0">'
    + '        <div>'
    + '          <h4 class="modal-title fw-bold" id="quoteModalLabel">Get Your Free Quote</h4>'
    + '          <p class="text-muted mb-0" style="font-size:.9rem;">We\'ll get back to you within 24 hours</p>'
    + '        </div>'
    + '        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>'
    + '      </div>'
    + '      <div class="modal-body pt-2">'
    + '        <div id="qmStatus" style="display:none;padding:1rem;border-radius:8px;margin-bottom:1rem;text-align:center;"></div>'
    + '        <form id="quoteModalForm">'
    + '          <div class="mb-3">'
    + '            <label class="form-label fw-bold" for="qmName">Name <span style="color:#dc3545;">*</span></label>'
    + '            <input type="text" class="form-control" id="qmName" name="name" placeholder="Your full name" required style="border-radius:8px;padding:.75rem 1rem;">'
    + '          </div>'
    + '          <div class="mb-3">'
    + '            <label class="form-label fw-bold" for="qmContact">Email or Phone <span style="color:#dc3545;">*</span></label>'
    + '            <input type="text" class="form-control" id="qmContact" name="contact" placeholder="Email address or phone number" required style="border-radius:8px;padding:.75rem 1rem;">'
    + '          </div>'
    + '          <div class="mb-3">'
    + '            <label class="form-label fw-bold" for="qmMessage">Message <small class="text-muted fw-normal">(optional)</small></label>'
    + '            <textarea class="form-control" id="qmMessage" name="message" rows="3" placeholder="Travel dates, ages, pre-existing conditions..." style="border-radius:8px;padding:.75rem 1rem;"></textarea>'
    + '          </div>'
    + '          <button type="submit" id="qmSubmitBtn" style="background:#3b82f6;color:#fff;border:none;border-radius:50px;padding:.85rem;font-size:1.05rem;font-weight:700;width:100%;transition:.3s;">'
    + '            <i class="fas fa-paper-plane me-2"></i>Send Enquiry'
    + '          </button>'
    + '        </form>'
    + '        <div class="text-center mt-3">'
    + '          <span class="text-muted" style="font-size:.85rem;">Or reach us directly:</span> '
    + '          <a href="https://wa.me/919740661531" class="text-success fw-bold text-decoration-none" style="font-size:.85rem;"><i class="fab fa-whatsapp me-1"></i>WhatsApp</a>'
    + '          <span class="text-muted mx-1">|</span>'
    + '          <a href="tel:+919740661531" class="fw-bold text-decoration-none" style="font-size:.85rem;color:#3b82f6;"><i class="fas fa-phone me-1"></i>Call</a>'
    + '        </div>'
    + '      </div>'
    + '    </div>'
    + '  </div>'
    + '</div>';

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Form submission handler
    document.getElementById('quoteModalForm').addEventListener('submit', function(e) {
        e.preventDefault();
        var btn = document.getElementById('qmSubmitBtn');
        var status = document.getElementById('qmStatus');
        var name = document.getElementById('qmName').value.trim();
        var contact = document.getElementById('qmContact').value.trim();
        var message = document.getElementById('qmMessage').value.trim();

        if (!name || !contact) {
            status.style.display = 'block';
            status.style.background = '#fee2e2';
            status.style.color = '#991b1b';
            status.textContent = 'Please fill in your name and email/phone.';
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
        status.style.display = 'none';

        var data = new FormData();
        data.append('name', name);
        data.append('contact', contact);
        data.append('message', message);
        data.append('timestamp', new Date().toLocaleString());
        data.append('page', window.location.href);

        fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: data })
        .then(function(r) { return r.json(); })
        .then(function(result) {
            if (result.result === 'success') {
                status.style.display = 'block';
                status.style.background = '#d1fae5';
                status.style.color = '#065f46';
                status.innerHTML = '<i class="fas fa-check-circle me-2"></i><strong>Thank you!</strong> We\'ll get back to you within 24 hours.';
                document.getElementById('quoteModalForm').reset();
            } else {
                throw new Error('fail');
            }
        })
        .catch(function() {
            status.style.display = 'block';
            status.style.background = '#fee2e2';
            status.style.color = '#991b1b';
            status.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>Something went wrong. Please try WhatsApp or call us.';
        })
        .finally(function() {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Enquiry';
        });
    });

    // Reset form when modal is closed
    document.getElementById('quoteModal').addEventListener('hidden.bs.modal', function() {
        document.getElementById('quoteModalForm').reset();
        var status = document.getElementById('qmStatus');
        status.style.display = 'none';
    });

    // Global helper
    window.openQuoteModal = function() {
        var modal = new bootstrap.Modal(document.getElementById('quoteModal'));
        modal.show();
    };
})();
