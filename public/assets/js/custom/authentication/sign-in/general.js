"use strict";

// Class definition
var KTSigninGeneral = (function () {
  // Elements
  var form;
  var submitButton;
  var validator;

  // Handle form
  var handleValidation = function (e) {
    // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
    validator = FormValidation.formValidation(form, {
      fields: {
        email: {
          validators: {
            regexp: {
              regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "The value is not a valid email address",
            },
            notEmpty: {
              message: "Email address is required",
            },
          },
        },
        password: {
          validators: {
            notEmpty: {
              message: "The password is required",
            },
          },
        },
      },
      plugins: {
        trigger: new FormValidation.plugins.Trigger(),
        bootstrap: new FormValidation.plugins.Bootstrap5({
          rowSelector: ".fv-row",
          eleInvalidClass: "", // comment to enable invalid state icons
          eleValidClass: "", // comment to enable valid state icons
        }),
      },
    });
  };

  var handleSubmitDemo = function (e) {
    // Handle form submit
    submitButton.addEventListener("click", function (e) {
      e.preventDefault();

      validator.revalidateField("password");

      validator.validate().then(function (status) {
        if (status == "Valid") {
          // Show loading indication
          submitButton.setAttribute("data-kt-indicator", "on");
          // Disable button to avoid multiple clicks
          submitButton.disabled = true;

          // Send form data to server using AJAX
          const email = form.querySelector('input[name="email"]').value;
          const password = form.querySelector('input[name="password"]').value;
          const formDataJson = JSON.stringify({ email, password });
          $.ajax({
            type: "POST",
            url: "/auth-log",
            data: formDataJson,
            contentType: "application/json",
            processData: false,
            success: function (response) {
              console.log(response);
              // Hide loading indication
              submitButton.removeAttribute("data-kt-indicator");
              // Enable button
              submitButton.disabled = false;
              if (response.success) {
                // Show success popup
                Swal.fire({
                  text: response.message,
                  icon: "success",
                  buttonsStyling: false,
                  confirmButtonText: "Ok, got it!",
                  customClass: {
                    confirmButton: "btn btn-primary",
                  },
                }).then(function (result) {
                  if (result.isConfirmed) {
                    var redirectUrl = form.getAttribute("data-kt-redirect-url");
                    if (redirectUrl) {
                      location.href = redirectUrl;
                    }
                  }
                });
              } else {
                // Show error popup
                Swal.fire({
                  text: response.message,
                  icon: "error",
                  buttonsStyling: false,
                  confirmButtonText: "Ok, got it!",
                  customClass: {
                    confirmButton: "btn btn-primary",
                  },
                });
              }
            },
            error: function (xhr, status, error) {
              // Show error popup
              const responseJSON = xhr.responseJSON;

              Swal.fire({
                text: responseJSON ? responseJSON.error : "Sorry, looks like there are some errors detected, please try again.",
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                  confirmButton: "btn btn-primary",
                },
              }).then(function () {
                location.reload(); // reload the page

              });
            },
            
          });
        } else {
          // Show error popup
          Swal.fire({
            text: "Sorry, looks like there are some errors detected, please try again.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
        }
      });
    });
  };

  var handleSubmitAjax = function (e) {
    // Handle form submit
    submitButton.addEventListener("click", function (e) {
      // Prevent button default action
      e.preventDefault();

      // Validate form
      validator.validate().then(function (status) {
        if (status == "Valid") {
          // Hide loading indication
          submitButton.removeAttribute("data-kt-indicator");

          // Enable button
          submitButton.disabled = false;

          // Check axios library docs: https://axios-http.com/docs/intro
          axios
            .post("/your/ajax/login/url", {
              email: form.querySelector('[name="email"]').value,
              password: form.querySelector('[name="password"]').value,
            })
            .then(function (response) {
              if (response) {
                form.querySelector('[name="email"]').value = "";
                form.querySelector('[name="password"]').value = "";

                const redirectUrl = form.getAttribute("data-kt-redirect-url");

                if (redirectUrl) {
                  location.href = redirectUrl;
                }
              } else {
                // Show error popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                Swal.fire({
                  text: "Sorry, the email or password is incorrect, please try again.",
                  icon: "error",
                  buttonsStyling: false,
                  confirmButtonText: "Ok, got it!",
                  customClass: {
                    confirmButton: "btn btn-primary",
                  },
                });
              }
            })
            .catch(function (error) {
              Swal.fire({
                text: "Sorry, looks like there are some errors detected, please try again.",
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                  confirmButton: "btn btn-primary",
                },
              });
            });
        } else {
          // Show error popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
          Swal.fire({
            text: "Sorry, looks like there are some errors detected, please try again.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
        }
      });
    });
  };

  // Public functions
  return {
    // Initialization
    init: function () {
      form = document.querySelector("#kt_sign_in_form");
      submitButton = document.querySelector("#kt_sign_in_submit");

      handleValidation();
      handleSubmitDemo(); // used for demo purposes only, if you use the below ajax version you can uncomment this one
      //handleSubmitAjax(); // use for ajax submit
    },
  };
})();

// On document ready
KTUtil.onDOMContentLoaded(function () {
  KTSigninGeneral.init();
});
