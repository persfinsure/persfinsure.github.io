/**
 * Dynamically enhances mailto:persfinsure@gmail.com links with
 * contextual subject, body template, and current page URL.
 * Skips links that just display the email address (topbar/footer).
 */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var links = document.querySelectorAll('a[href^="mailto:persfinsure@gmail.com"]');
    var pageUrl = window.location.href;
    var pageTitle = document.title || 'Persfinsure';

    links.forEach(function (link) {
      var text = (link.textContent || '').trim().toLowerCase();

      // Skip plain email display links (topbar, footer showing the address)
      if (text === 'persfinsure@gmail.com') return;

      var subject = '';
      var body = '';

      // Service card links on index.html — find nearest h5 for insurance type
      var serviceItem = link.closest('.service-item') || link.closest('.p-4');
      if (serviceItem) {
        var h5 = serviceItem.querySelector('h5');
        var insuranceType = h5 ? h5.textContent.trim() : 'Insurance';
        subject = 'Quote Request - ' + insuranceType;
        body = 'Hi Persfinsure,\n\n' +
          'I am interested in ' + insuranceType + '.\n\n' +
          'Name: \n' +
          'Contact (Phone/Email): \n' +
          'Details: \n\n' +
          'Please share the best plan options.\n' +
          'Thank you!\n\n' +
          '---\nPage: ' + pageUrl;
        link.href = buildMailto(subject, body);
        return;
      }

      // Footer "Contact Us" button (has btn-link class)
      if (link.classList.contains('btn-link') || link.closest('footer') || link.closest('.footer')) {
        subject = 'General Inquiry - Persfinsure';
        body = 'Hi Persfinsure,\n\n' +
          'I would like to inquire about your insurance services.\n\n' +
          'Name: \n' +
          'Contact (Phone/Email): \n' +
          'Insurance Type: \n' +
          'Message: \n\n' +
          'Thank you!\n\n' +
          '---\nPage: ' + pageUrl;
        link.href = buildMailto(subject, body);
        return;
      }

      // Blog post CTA links (e.g. "Email us", "Contact us")
      if (text.indexOf('email us') !== -1 || text.indexOf('contact us') !== -1) {
        subject = 'Inquiry from Blog - ' + pageTitle;
        body = 'Hi Persfinsure,\n\n' +
          'I was reading your blog post "' + pageTitle + '" and would like more information.\n\n' +
          'Name: \n' +
          'Contact (Phone/Email): \n' +
          'Message: \n\n' +
          'Thank you!\n\n' +
          '---\nPage: ' + pageUrl;
        link.href = buildMailto(subject, body);
        return;
      }
    });

    function buildMailto(subject, body) {
      return 'mailto:persfinsure@gmail.com' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    }
  });
})();
