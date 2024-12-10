document.addEventListener('DOMContentLoaded', () => {
    // 금액 입력 필드 콤마 처리
    document.addEventListener('input', (event) => {
        const target = event.target;
        if (['cashAmount', 'realEstateValue', 'stockPrice', 'otherAssetValue', 'myInheritance'].includes(target.id) ||
            target.classList.contains('amount-input')) {
            const rawValue = target.value.replace(/[^0-9]/g, '');
            if (rawValue === '') {
                target.value = '';
                return;
            }
            const caretPosition = target.selectionStart;
            target.value = parseInt(rawValue, 10).toLocaleString();
            const newCaretPosition = target.value.length - rawValue.length + caretPosition;
            target.setSelectionRange(newCaretPosition, newCaretPosition);
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

    // 상속인 추가 버튼 이벤트
    document.getElementById('addHeirButton').addEventListener('click', () => {
        const heirContainer = document.getElementById('heirContainer');
        const newHeir = document.createElement('div');
        newHeir.className = 'heir-entry';
        newHeir.innerHTML = `
            <input type="text" placeholder="이름">
            <select>
                <option value="spouse">배우자</option>
                <option value="adultChild">성년 자녀</option>
                <option value="minorChild">미성년 자녀</option>
                <option value="parent">부모</option>
                <option value="sibling">형제자매</option>
                <option value="other">기타</option>
            </select>
            <input type="number" placeholder="상속 비율 (%)">
        `;
        heirContainer.appendChild(newHeir);
    });

    // 계산하기 버튼 이벤트
    document.getElementById('calculateButton').addEventListener('click', () => {
        try {
            console.log('계산하기 버튼 클릭됨');
            calculateInheritance();
        } catch (error) {
            console.error('계산 중 오류 발생:', error);
        }
    });
});

// 공제 계산 함수
function calculateExemption(relationship) {
    let exemption = 0; // 기본 공제는 별도로 계산

    if (relationship === 'spouse') exemption = 3000000000; // 배우자 최대 30억 원
    else if (relationship === 'adultChild') exemption = 50000000; // 성년 자녀
    else if (relationship === 'minorChild') exemption = Math.min(20000000 * 20, 520000000); // 미성년 자녀
    else if (relationship === 'parent') exemption = 50000000; // 부모
    else if (relationship === 'sibling') exemption = 50000000; // 형제자매
    else exemption = 10000000; // 기타 상속인

    return exemption;
}

// 상속 계산 함수
function calculateInheritance() {
    const heirs = Array.from(document.querySelectorAll('.heir-entry')).map(heir => {
        const name = heir.querySelector('input[type="text"]').value || '무명';
        const relationship = heir.querySelector('select').value || '기타';
        const share = parseFloat(heir.querySelector('input[type="number"]').value) || 0;
        return { name, relationship, share };
    });

    const totalAssetValue = parseFloat(document.getElementById('totalAssetValue').value) || 0;

    // 기본 공제: 한 번만 추가
    let totalExemption = 500000000;

    // 상속인별 공제 합산
    heirs.forEach(heir => {
        totalExemption += calculateExemption(heir.relationship);
    });

    // 총 상속인 비율 합산 체크
    const totalShare = heirs.reduce((sum, heir) => sum + heir.share, 0);
    if (totalShare > 100) {
        document.getElementById('result').innerHTML = `<p style="color:red;">상속 비율 합계가 100%를 초과할 수 없습니다.</p>`;
        return;
    }

    const taxableAmount = Math.max(totalAssetValue - totalExemption, 0);

    const result = heirs.map(heir => {
        const heirAssetValue = (totalAssetValue * heir.share) / 100;
        let heirExemption = calculateExemption(heir.relationship);

        const heirTaxableAmount = Math.max(heirAssetValue - heirExemption, 0);

        const tax = (() => {
            const taxBrackets = [
                { limit: 100000000, rate: 0.1, deduction: 0 },
                { limit: 500000000, rate: 0.2, deduction: 10000000 },
                { limit: 1000000000, rate: 0.3, deduction: 60000000 },
                { limit: Infinity, rate: 0.4, deduction: 160000000 }
            ];

            let totalTax = 0;
            for (const bracket of taxBrackets) {
                if (heirTaxableAmount > bracket.limit) {
                    totalTax += (bracket.limit) * bracket.rate;
                } else {
                    totalTax += (heirTaxableAmount) * bracket.rate - bracket.deduction;
                    break;
                }
            }
            return Math.max(totalTax, 0);
        })();

        return {
            name: heir.name,
            share: heir.share,
            assetValue: heirAssetValue,
            exemption: heirExemption,
            taxableAmount: heirTaxableAmount,
            tax,
        };
    });

    // 결과 출력
    document.getElementById('result').innerHTML = `
        <h3>계산 결과</h3>
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
