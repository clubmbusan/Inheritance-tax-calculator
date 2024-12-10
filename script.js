document.addEventListener('DOMContentLoaded', function () {
    // 금액 입력 필드에 천 단위 콤마 추가
    function formatWithCommas(value) {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function parseToNumber(value) {
        return parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    }

    function addCommaFormattingListener(inputField) {
        inputField.addEventListener('input', function (event) {
            const rawValue = parseToNumber(event.target.value).toString();
            event.target.value = formatWithCommas(rawValue);
        });
    }

    document.querySelectorAll('.amount-input').forEach(addCommaFormattingListener);

    // 계산 모드 변경
    const calculationMode = document.getElementById('calculationMode');
    const individualMode = document.getElementById('individualMode');
    const groupMode = document.getElementById('groupMode');

    calculationMode.addEventListener('change', function () {
        if (calculationMode.value === 'individual') {
            individualMode.style.display = 'block';
            groupMode.style.display = 'none';
        } else {
            individualMode.style.display = 'none';
            groupMode.style.display = 'block';
        }
    });

    // 팝업 열기/닫기
    const propertyPopup = document.getElementById('propertyPopup');
    const addPropertyButton = document.getElementById('addPropertyButton');
    const closePopupButton = document.getElementById('closePopupButton');

    addPropertyButton.addEventListener('click', function () {
        propertyPopup.style.display = 'block';
    });

    closePopupButton.addEventListener('click', function () {
        propertyPopup.style.display = 'none';
    });

    // 상속인 추가
    const addHeirButton = document.getElementById('addHeirButton');
    const heirList = document.getElementById('heirList');

    addHeirButton.addEventListener('click', function () {
        const newHeir = document.createElement('div');
        newHeir.className = 'input-group';
        newHeir.innerHTML = `
            <input type="text" class="input-field" placeholder="이름 입력">
            <select class="input-field">
                <option value="spouse">배우자</option>
                <option value="child">자녀</option>
                <option value="other">기타</option>
            </select>
            <input type="number" class="input-field" placeholder="지분율 입력">
        `;
        heirList.appendChild(newHeir);
    });

    // 계산 로직 추가
    const calculateButton = document.getElementById('calculateButton');
    calculateButton.addEventListener('click', function () {
        // 상속세 계산 로직 구현 (추후 개발)
        alert('계산 로직 구현 예정');
    });
});
