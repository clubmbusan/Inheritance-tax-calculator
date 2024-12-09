document.addEventListener('DOMContentLoaded', () => {
    // 금액 입력 필드 콤마 추가 처리
    document.addEventListener('input', (event) => {
        const target = event.target;
        // 금액 입력 필드만 처리
        if (['cashAmount', 'realEstateValue', 'stockPrice', 'otherAssetValue', 'myInheritance'].includes(target.id) ||
            target.classList.contains('amount-input')) {
            const rawValue = target.value.replace(/[^0-9]/g, ''); // 숫자 이외의 문자 제거
            if (rawValue === '') {
                target.value = ''; // 빈 값 처리
                return;
            }
            target.value = parseInt(rawValue, 10).toLocaleString(); // 콤마 추가
        }
    });

    // 재산 유형 선택 이벤트 리스너
    const assetType = document.getElementById('assetType');
    const fields = {
        cash: document.getElementById('cashInputField'),
        realEstate: document.getElementById('realEstateInputField'),
        stock: document.getElementById('stockInputField'),
        others: document.getElementById('othersInputField'),
    };

    assetType.addEventListener('change', () => {
        Object.values(fields).forEach(field => field.style.display = 'none');
        fields[assetType.value].style.display = 'block';
    });

    // 계산하기 버튼 이벤트
    document.getElementById('calculateButton').addEventListener('click', () => {
        const calculationType = document.querySelector('input[name="calculationType"]:checked').value;

        // 재산 유형에 따른 금액 가져오기
        const assetValue = (() => {
            if (assetType.value === 'cash') return parseInt(document.getElementById('cashAmount').value.replace(/,/g, '') || '0', 10);
            if (assetType.value === 'realEstate') return parseInt(document.getElementById('realEstateValue').value.replace(/,/g, '') || '0', 10);
            if (assetType.value === 'stock') {
                const quantity = parseInt(document.getElementById('stockQuantity').value || '0', 10);
                const price = parseInt(document.getElementById('stockPrice').value.replace(/,/g, '') || '0', 10);
                return quantity * price;
            }
            if (assetType.value === 'others') return parseInt(document.getElementById('otherAssetValue').value.replace(/,/g, '') || '0', 10);
            return 0;
        })();

        // 상속인 정보 수집
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

        if (calculationType === 'individual') {
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

            // 개인분 결과 출력
            const resultDiv = document.getElementById('result');
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `
                <h3>개인분 계산 결과</h3>
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
        } else if (calculationType === 'total') {
            const totalTax = heirs.reduce((sum, heir) => {
                const heirAssetValue = (assetValue * heir.share) / 100;
                const exemption = calculateExemption(heir.relationship);
                const taxableAmount = Math.max(heirAssetValue - exemption, 0);
                const tax = calculateTax(taxableAmount);

                return sum + tax;
            }, 0);

            // 전체분 결과 출력
            const resultDiv = document.getElementById('result');
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `
                <h3>전체분 계산 결과</h3>
                <p>총 상속세: ${totalTax.toLocaleString()} 원</p>
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
