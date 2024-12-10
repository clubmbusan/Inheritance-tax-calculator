document.addEventListener('DOMContentLoaded', () => {
    // 금액 입력 필드에 콤마 추가 처리
    document.addEventListener('input', (event) => {
    const target = event.target;
    if (target.classList.contains('amount-input')) {
        const rawValue = target.value.replace(/[^0-9]/g, '');
        target.value = rawValue ? parseInt(rawValue, 10).toLocaleString() : '';
    }
});

    // 선택된 재산 목록 및 총합 관리
    const assetList = document.getElementById('assetList');
    const totalAssetValue = document.getElementById('totalAssetValue');

    // 재산 추가 버튼 이벤트
    document.getElementById('addAssetButton').addEventListener('click', () => {
        const assetType = document.getElementById('assetTypeDropdown').value;
        const assetAmount = prompt('재산 금액을 입력하세요 (원):');
        if (!assetAmount || isNaN(assetAmount)) return;

        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${document.querySelector(`#assetTypeDropdown option[value="${assetType}"]`).textContent}: ${parseInt(assetAmount).toLocaleString()} 원
            <button type="button" class="delete-asset">삭제</button>
        `;
        assetList.appendChild(listItem);

        updateTotal(parseInt(assetAmount));
        listItem.querySelector('.delete-asset').addEventListener('click', () => {
            updateTotal(-parseInt(assetAmount));
            listItem.remove();
        });
    });

    // 총합 업데이트
    const updateTotal = (amount) => {
        const currentTotal = parseInt(totalAssetValue.textContent.replace(/,/g, '')) || 0;
        totalAssetValue.textContent = (currentTotal + amount).toLocaleString();
    };

    // 계산 모드 선택에 따른 섹션 표시
    document.getElementById('calculationMode').addEventListener('change', (event) => {
        const mode = event.target.value;
        document.getElementById('individualSection').style.display = mode === 'individual' ? 'block' : 'none';
        document.getElementById('totalSection').style.display = mode === 'total' ? 'block' : 'none';
    });

    // 계산하기 버튼 이벤트
    document.getElementById('calculateButton').addEventListener('click', () => {
        const mode = document.getElementById('calculationMode').value;
        if (mode === 'individual') {
            calculateIndividual();
        } else if (mode === 'total') {
            calculateTotal();
        }
    });

    // 개인 계산
    const calculateIndividual = () => {
        const myInheritance = parseInt(document.getElementById('myInheritance').value.replace(/,/g, '') || '0', 10);
        const relationship = document.getElementById('relationship').value;
        const exemption = calculateExemption(relationship);
        const taxableAmount = Math.max(myInheritance - exemption, 0);
        const tax = calculateTax(taxableAmount);

        const resultDiv = document.getElementById('result');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <h3>개인 계산 결과</h3>
            <p>상속받은 재산 금액: ${myInheritance.toLocaleString()} 원</p>
            <p>공제 금액: ${exemption.toLocaleString()} 원</p>
            <p>과세 금액: ${taxableAmount.toLocaleString()} 원</p>
            <p><strong>상속세: ${tax.toLocaleString()} 원</strong></p>
        `;
    };

    // 전체 계산
    const calculateTotal = () => {
        const heirs = Array.from(document.querySelectorAll('.heir-entry')).map(heir => {
            const name = heir.querySelector('input[type="text"]').value;
            const relationship = heir.querySelector('select').value;
            const share = parseFloat(heir.querySelector('input[type="number"]').value) || 0;

            return { name, relationship, share };
        });

        const totalShare = heirs.reduce((sum, heir) => sum + heir.share, 0);
        if (totalShare > 100) {
            document.getElementById('result').innerHTML = `<p style="color:red;">상속 비율 합계가 100%를 초과할 수 없습니다.</p>`;
            return;
        }

        const assetValue = parseInt(totalAssetValue.textContent.replace(/,/g, '')) || 0;

        const result = heirs.map(heir => {
            const heirAssetValue = (assetValue * heir.share) / 100;
            const exemption = calculateExemption(heir.relationship);
            const taxableAmount = Math.max(heirAssetValue - exemption, 0);
            const tax = calculateTax(taxableAmount);

            return {
                name: heir.name,
                share: heir.share,
                assetValue: heirAssetValue,
                exemption,
                taxableAmount,
                tax,
            };
        });

        const resultDiv = document.getElementById('result');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <h3>전체 계산 결과</h3>
            ${result.map(r => `
                <p>
                    <strong>${r.name}</strong><br>
                    상속 비율: ${r.share}%<br>
                    상속받은 재산 금액: ${r.assetValue.toLocaleString()} 원<br>
                    공제 금액: ${r.exemption.toLocaleString()} 원<br>
                    과세 금액: ${r.taxableAmount.toLocaleString()} 원<br>
                    상속세: ${r.tax.toLocaleString()} 원
                </p>
            `).join('')}
        `;
    };

    // 공제 금액 계산
    const calculateExemption = (relationship) => {
        if (relationship === 'spouse') return 3000000000;
        if (relationship === 'adultChild') return 50000000;
        if (relationship === 'minorChild') return 20000000 * 20;
        if (relationship === 'parent') return 50000000;
        if (relationship === 'sibling') return 50000000;
        return 10000000;
    };

    // 상속세 계산
    const calculateTax = (taxableAmount) => {
        const taxBrackets = [
            { limit: 100000000, rate: 0.1, deduction: 0 },
            { limit: 500000000, rate: 0.2, deduction: 10000000 },
            { limit: 1000000000, rate: 0.3, deduction: 60000000 },
            { limit: Infinity, rate: 0.4, deduction: 160000000 }
        ];

        let totalTax = 0;
        for (const bracket of taxBrackets) {
            if (taxableAmount > bracket.limit) {
                totalTax += (bracket.limit) * bracket.rate;
            } else {
                totalTax += (taxableAmount) * bracket.rate - bracket.deduction;
                break;
            }
        }
        return Math.max(totalTax, 0);
    };
});
