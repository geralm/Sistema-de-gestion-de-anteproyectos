<script>
  $(document).ready(function () {
    $('.dropdown-item input[type="checkbox"]').on('change', function () {
      if ($(this).prop('checked')) {
        // Uncheck all other checkboxes
        $('.dropdown-item input[type="checkbox"]').not(this).prop('checked', false);
      }
    })
    
    });
</script>
