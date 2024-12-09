document.addEventListener('DOMContentLoaded', () => {
    // 금액 입력 필드 콤마 추가 처리
    document.addEventListener('input', (event) => {
        const target = event.target;
        if (['cashAmount', 'realEstateValue', 'stockPrice', 'otherAssetValue', 'myInheritance'].includes(target.id)) {
            const rawValue = target.value.replace(/[^0-9]/g, '');
            target.value = rawValue ? parseInt(rawValue, 10).toLocaleString() : '';
        }
    });

    // 재산 유형 선택 이벤트
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
    });

    // 계산 모드 선택
    document.querySelectorAll('input[name="calculationType"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            const mode = event.target.value;
            if (mode === 'individual') {
                document.getElementById('myInheritance').disabled = false;
                document.getElementById('heirContainer').style.display = 'none';
            } else {
                document.getElementById('myInheritance').disabled = true;
                document.getElementById('heirContainer').style.display = 'block';
            }
        });
    });

    // 계산하기 버튼 이벤트
    document.getElementById('calculateButton').addEventListener('click', () => {
        const calculationType = document.querySelector('input[name="calculationType"]:checked').value;

        // 재산 유형에 따른 총 금액 계산
        const assetValue = (() => {
            let total = 0;
            if (document.getElementById('cash').checked) {
                total += parseInt(document.getElementById('cashAmount').value.replace(/,/g, '') || '0', 10);
            }
            if (document.getElementById('realEstate').checked) {
                total += parseInt(document.getElementById('realEstateValue').value.replace(/,/g, '') || '0', 10);
            }
            if (document.getElementById('stock').checked) {
                const quantity = parseInt(document.getElementById('stockQuantity').value || '0', 10);
                const price = parseInt(document.getElementById('stockPrice').value.replace(/,/g, '') || '0', 10);
                total += quantity * price;
            }
            if (document.getElementById('others').checked) {
                total += parseInt(document.getElementById('otherAssetValue').value.replace(/,/g, '') || '0', 10);
            }
            return total;
        })();

        // 개인 계산 로직
        if (calculationType === 'individual') {
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
        }

        // 전체 계산 로직
        if (calculationType === 'total') {
            const heirs = Array.from(document.querySelectorAll('.heir-entry')).map(heir => {
                const name = heir.querySelector('input[type="text"]').value;
                const relationship = heir.querySelector('select').value;
                const share = parseFloat(heir.querySelector('input[type="number"]').value) || 0;

                return { name, relationship, share };
            });

            // 상속인 비율 합계 확인
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
        }
    });

    // 공제 금액 자동 계산 함수
    const calculateExemption = (relationship) => {
        if (relationship === 'spouse') return 3000000000; // 배우자
        if (relationship === 'adultChild') return 50000000; // 성년 자녀
        if (relationship === 'minorChild') return 20000000 * 20; // 미성년 자녀
        if (relationship === 'parent') return 50000000; // 부모
        if (relationship === 'sibling') return 50000000; // 형제자매
        return 10000000; // 기타
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
                totalTax += (bracket.limit) * bracket.rate;
            } else {
                totalTax += (taxableAmount) * bracket.rate - bracket.deduction;
                break;
            }
        }
        return Math.max(totalTax, 0);
    };
});
