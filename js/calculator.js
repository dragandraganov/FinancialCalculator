$(document).ready(function () {
    $('input[name="calc-sum"]').keypress(function () {
        return isKeyPartOfDecimalNumber(event);
    })

    $('#btn-reset').click(function () {
        resetForm($('#calc-form'));
    })

    $('#btn-calc').click(function () {
        calculate();
    })

    $('.date-form').keypress(function () {
        return checkDateFormat(event);
    })

})

var monthsWith31Days = [1, 3, 5, 7, 8, 10, 12];
var monthsWith30Days = [4, 6, 9, 11];

function isKeyPartOfDecimalNumber(evt) {
    var inputFormValue = evt.target.value;
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode !== 46 && (charCode < 48 || charCode > 57))) {
        $('#error-sum-info').show();
        return false;
    }
    if (charCode === 46) {
        if (inputFormValue.indexOf('.') > -1) {
            $('#error-sum-info').show();
            return false;
        }
    }
    $('#error-sum-info').hide();
    return true;
}

function resetForm($form) {
    $form.find('input:text, input:password, input:file, textarea').val('');
    $form.find('input:radio, input:checkbox')
        .removeAttr('checked').removeAttr('selected');
    var selectControls = $form.find('select');
    selectControls.each(
        function () {
            $(this).val($("option:first", this).val());
        })
    $('#error-sum-info').hide();
    $('.error-date-info').hide();
}

function calculate() {

}

function checkDateFormat(evt) {
    var inputFormValue = $(evt.target).val();
    var decimalPointsCount = inputFormValue.split(".").length - 1;
    var charCode = (evt.which) ? evt.which : event.keyCode;
    var dateErrorInfo = $(evt.target).parent().parent().next();

    if (charCode > 31 && (charCode !== 46 && (charCode < 48 || charCode > 57))) {
        dateErrorInfo.text('Въведете само цифри и точка "." за разделител').show();
        return false;
    }
    if (charCode !== 46) {
        if (decimalPointsCount === 0) {
            var day = inputFormValue + String.fromCharCode(charCode);
            if (day.length > 2
                || (day.length === 1 && parseInt(day) > 3)
                || parseInt(day) > 31
                || (day.length === 2 && parseInt(day) == 0)) {
                dateErrorInfo.text('Опитвате се да въведете невалиден ден от месеца').show();
                return false;
            }
        }
        if (decimalPointsCount === 1) {
            var month = inputFormValue.substring(3) + String.fromCharCode(charCode);
            if (month.length > 2
                || (month.length === 1 && parseInt(month) > 1)
                || parseInt(month) > 12
                || (month.length === 2 && parseInt(month) == 0)) {
                dateErrorInfo.text('Опитвате се да въведете невалиден месец').show();
                return false;
            }
            if (month.length === 2) {
                var day = inputFormValue.substring(0, 2);
                if (parseInt(day) > 29 && parseInt(month) === 2) {
                    dateErrorInfo.text('Февруари може да съдържа максимум 29 дена').show();
                    return false;
                }

                if (parseInt(day) === 31 && monthsWith31Days.indexOf(parseInt(month)) === -1) {
                    dateErrorInfo.text('Месецът не съдържа 31 дена').show();
                    return false;
                }
            }
        }
        if (decimalPointsCount === 2) {
            var day = inputFormValue.substring(0, 2);
            var month = inputFormValue.substring(3, 5);
            var year = inputFormValue.substring(6) + String.fromCharCode(charCode);
            if (year.length > 4) {
                dateErrorInfo.text('Опитвате се да въведете невалидна година').show();
                return false;
            }
            if ((year.length === 1 && (parseInt(year) < 1 || parseInt(year) > 2))
                || (year.length === 2 && (parseInt(year) < 19 ))) {
                dateErrorInfo.text('Калкулаторът работи с дати между 01.01.1900 до 31.12.2999').show();
                return false;
            }
            if (year.length == 4) {
                if (parseInt(day) == 29 && parseInt(month) == 2) {
                    if (!isLeapYear(parseInt(year))) {
                        dateErrorInfo.text(year + ' година не е високосна').show();
                        return false;
                    }
                }
            }
        }
    }
    else {
        if (inputFormValue.length < 2) {
            dateErrorInfo.text('Опитвате се да въведете невалиден ден от месеца').show();
            return false;
        }

        if (inputFormValue.length > 2 && inputFormValue.length < 5) {
            dateErrorInfo.text('Опитвате се да въведете невалиден месец').show();
            return false;
        }

        if (decimalPointsCount === 2) {
            dateErrorInfo.text('Опитвате се да въведете невалидна година').show();
            return false;
        }
    }

    dateErrorInfo.hide();
    return true;
}

function isLeapYear(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}