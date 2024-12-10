document.addEventListener('DOMContentLoaded', () => {
    // 금액 입력 필드 콤마 추가 처리
    document.addEventListener('input', (event) => {
        const target = event.target;
        if (target.classList.contains('amount-input')) {
            const rawValue = target.value.replace(/[^0-9]/g, '');
            target.value = rawValue ? parseInt(rawValue, 10).toLocaleString() : '';
        }
    });

    // 재산 유형 선택
    const assetFields = {
        cash: document.getElementById('cashField'),
        realEstate: document.getElementById('realEstateField'),
        stock: document.getElementById('stockField'),
        others: document.getElementById('othersField'),
    };

    document.getElementById('assetTypeContainer').addEventListener('change', () => {
        Object.keys(assetFields).forEach(key => {
            assetFields[key].style.display = document.getElementById(key).checked ? 'block' : 'none';
        });
        updateAssetList();
    });

    // 계산 모드 선택
    document.getElementById('calculationMode').addEventListener('change', (event) => {
        const mode = event.target.value;
        document.getElementById('individualSection').style.display = mode === 'individual' ? 'block' : 'none';
        document.getElementById('totalSection').style.display = mode === 'total' ? 'block' : 'none';
    });

    // 선택된 재산 목록 업데이트
    const updateAssetList = () => {
        const selectedAssets = [];
        Object.keys(assetFields).forEach((type) => {
            const inputField = document.getElementById(`${type}Amount`);
            if (document.getElementById(type).checked && inputField && inputField.value) {
                const value = parseInt(inputField.value.replace(/,/g, '') || '0', 10);
                if (value > 0) {
                    selectedAssets.push({ type, value });
                }
            }
        });

        const assetList = document.getElementById('assetList');
        const totalValue = selectedAssets.reduce((sum, asset) => sum + asset.value, 0);
        document.getElementById('totalAssetValue').textContent = totalValue.toLocaleString();
        assetList.innerHTML = selectedAssets.map(asset => `<li>${asset.type}: ${asset.value.toLocaleString()} 원</li>`).join('');
    };

    // 공제 계산 함수
    const calculateExemption = (relationship) => {
        if (relationship === 'spouse') return 3000000000;
        if (relationship === 'adultChild') return 50000000;
        if (relationship === 'minorChild') return 20000000 * 20;
        if (relationship === 'parent') return 50000000;
        if (relationship === 'sibling') return 50000000;
        return 10000000;
    };

    // 상속세 계산 함수
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
                totalTax += bracket.limit * bracket.rate;
            } else {
                totalTax += taxableAmount * bracket.rate - bracket.deduction;
                break;
            }
        }
        return Math.max(totalTax, 0);
    };

    // 계산 로직
    document.getElementById('calculateButton').addEventListener('click', () => {
        const mode = document.getElementById('calculationMode').value;
        const assetValue = parseInt(document.getElementById('totalAssetValue').textContent.replace(/,/g, ''), 10) || 0;

        if (mode === 'individual') {
            const myInheritance = parseInt(document.getElementById('myInheritance').value.replace(/,/g, ''), 10);
            const relationship = document.getElementById('relationship').value;

            const exemption = calculateExemption(relationship);
            const taxableAmount = Math.max(myInheritance - exemption, 0);
            const tax = calculateTax(taxableAmount);

            document.getElementById('result').innerHTML = `
                <h3>개인 계산 결과</h3>
                <p>상속받은 재산 금액: ${myInheritance.toLocaleString()} 원</p>
                <p>공제 금액: ${exemption.toLocaleString()} 원</p>
                <p>과세 금액: ${taxableAmount.toLocaleString()} 원</p>
                <p><strong>상속세: ${tax.toLocaleString()} 원</strong></p>
            `;
        } else if (mode === 'total') {
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

            const result = heirs.map(heir => {
                const heirAssetValue = (assetValue * heir.share) / 100;
                const exemption = calculateExemption(heir.relationship);
                const taxableAmount = Math.max(heirAssetValue - exemption, 0);
                const tax = calculateTax(taxableAmount);

                return `
                    <p>
                        <strong>${heir.name}</strong><br>
                        상속받은 재산 금액: ${heirAssetValue.toLocaleString()} 원<br>
                        공제 금액: ${exemption.toLocaleString()} 원<br>
                        과세 금액: ${taxableAmount.toLocaleString()} 원<br>
                        상속세: ${tax.toLocaleString()} 원
                    </p>
                `;
            }).join('');

            document.getElementById('result').innerHTML = `<h3>전체 계산 결과</h3>${result}`;
        }
    });
});
