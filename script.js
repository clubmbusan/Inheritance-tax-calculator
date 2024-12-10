// script.js

document.addEventListener('DOMContentLoaded', () => {
    // 재산 유형 선택 드롭다운
    const assetType = document.getElementById('assetType');
    const assetInputContainer = document.getElementById('assetInputContainer');
    const assetAmountInput = document.getElementById('assetAmount');

    // 계산기 선택 드롭다운
    const calculatorType = document.getElementById('calculatorType');
    const personalSection = document.getElementById('personal-inheritance');
    const totalSection = document.getElementById('total-inheritance');

    // 초기 설정
    assetType.value = 'cash';
    calculatorType.addEventListener('change', (event) => {
        if (event.target.value === 'personal') {
            personalSection.style.display = 'block';
            totalSection.style.display = 'none';
        } else {
            personalSection.style.display = 'none';
            totalSection.style.display = 'block';
        }
    });

    // 재산 유형 변경 시 입력 필드 업데이트
    assetType.addEventListener('change', () => {
        const selectedType = assetType.value;

        if (selectedType === 'cash') {
            assetInputContainer.querySelector('label').textContent = '현금 금액:';
            assetAmountInput.placeholder = '현금 금액을 입력하세요';
        } else if (selectedType === 'realEstate') {
            assetInputContainer.querySelector('label').textContent = '부동산 금액:';
            assetAmountInput.placeholder = '부동산 금액을 입력하세요';
        } else if (selectedType === 'stocks') {
            assetInputContainer.querySelector('label').textContent = '주식 금액:';
            assetAmountInput.placeholder = '주식 금액을 입력하세요';
        }
    });

    // 개인 상속분 계산
    document.getElementById('personalCalculateButton').addEventListener('click', () => {
        const assetAmount = parseFloat(assetAmountInput.value) || 0;
        const relationship = document.getElementById('personalRelationship').value;
        const exemption = calculateExemption(relationship);

        const taxableAmount = Math.max(assetAmount - exemption, 0);
        const tax = calculateTax(taxableAmount);

        document.getElementById('personalResult').innerHTML = `
            <h3>개인 상속분 계산 결과</h3>
            <p>과세 금액: ${taxableAmount.toLocaleString()} 원</p>
            <p>상속세: ${tax.toLocaleString()} 원</p>
        `;
    });

    // 전체 상속분 계산
    document.getElementById('totalCalculateButton').addEventListener('click', () => {
        // 전체 상속 계산 로직 추가
    });
});

// 공제 계산 함수
function calculateExemption(relationship) {
    let exemption = 0;
    if (relationship === 'spouse') exemption = 3000000000;
    else if (relationship === 'adultChild') exemption = 50000000;
    else if (relationship === 'minorChild') exemption = Math.min(20000000 * 20, 520000000);
    else if (relationship === 'parent') exemption = 50000000;
    else if (relationship === 'sibling') exemption = 50000000;
    else exemption = 10000000;
    return exemption;
}

// 세금 계산 함수
function calculateTax(amount) {
    const taxBrackets = [
        { limit: 100000000, rate: 0.1 },
        { limit: 500000000, rate: 0.2 },
        { limit: 1000000000, rate: 0.3 },
        { limit: Infinity, rate: 0.4 }
    ];

    let tax = 0;
    for (const bracket of taxBrackets) {
        if (amount > bracket.limit) {
            tax += bracket.limit * bracket.rate;
            amount -= bracket.limit;
        } else {
            tax += amount * bracket.rate;
            break;
        }
    }
    return tax;
}
