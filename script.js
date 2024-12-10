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
            const caretPosition = target.selectionStart; // 커서 위치 저장
            target.value = parseInt(rawValue, 10).toLocaleString(); // 콤마 추가
            const newCaretPosition = target.value.length - rawValue.length + caretPosition; // 새로운 커서 위치 계산
            target.setSelectionRange(newCaretPosition, newCaretPosition); // 커서 위치 복원

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
   const relationshipOptions = [
    { value: 'spouse', label: '배우자' },
    { value: 'adultChild', label: '성년 자녀' },
    { value: 'minorChild', label: '미성년 자녀' },
    { value: 'parent', label: '부모' },
    { value: 'sibling', label: '형제자매' },
    { value: 'other', label: '기타' },
];

// 상속인 추가 버튼 이벤트
document.getElementById('addHeirButton').addEventListener('click', () => {
    const heirContainer = document.getElementById('heirContainer');
    const newHeir = document.createElement('div');
    newHeir.className = 'heir-entry';
    newHeir.innerHTML = `
        <input type="text" placeholder="이름">
        <select>
            ${relationshipOptions.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
        </select>
        <input type="number" placeholder="상속 비율 (%)">
    `;
    heirContainer.appendChild(newHeir);
});


    // 공제 금액 자동 계산
const relationshipInput = document.getElementById('relationship');
const exemptionInput = document.getElementById('exemptionAmount');

function calculateExemption(relationship) {
    let exemption = 500000000; // 기본 공제 5억 원

    if (relationship === 'spouse') {
        exemption += 3000000000; // 배우자 최대 30억 원
    } else if (relationship === 'adultChild') {
        exemption += 50000000; // 성년 자녀 5천만 원
    } else if (relationship === 'minorChild') {
        const minorExemption = 20000000 * 20; // 미성년 공제 계산
        exemption += Math.min(minorExemption, 520000000); // 최대 공제 금액: 5억 2천만 원
    } else if (relationship === 'parent') {
        exemption += 50000000; // 부모 5천만 원
    } else if (relationship === 'sibling') {
        exemption += 50000000; // 형제자매 5천만 원
    } else if (relationship === 'other') {
        exemption += 10000000; // 기타 상속인
    }

    return exemption;
}

// 공제 금액 자동 계산 이벤트
relationshipInput.addEventListener('change', () => {
    const relationship = relationshipInput.value;
    const exemption = calculateExemption(relationship); // 공제 계산 함수 호출
    exemptionInput.value = exemption.toLocaleString(); // 결과를 입력 필드에 표시
});

    // 계산하기 버튼 이벤트
    document.getElementById('calculateButton').addEventListener('click', () => {
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

      // 상속인별 세금 계산
const result = heirs.map(heir => {
    const heirAssetValue = (assetValue * heir.share) / 100; // 상속받은 재산 금액
    let exemption = 500000000; // 기본 공제 5억 원

    // 상속인별 추가 공제
    if (heir.relationship === 'spouse') {
        exemption += 3000000000; // 배우자 최대 30억 원
    } else if (heir.relationship === 'adultChild') {
        exemption += 50000000; // 성년 자녀 5천만 원
    } else if (heir.relationship === 'minorChild') {
        // 미성년 공제 로직 단순화
        const minorExemption = 20000000 * 20; // 최대 미성년 공제 (20년 기준)
        exemption += Math.min(minorExemption, 520000000); // 최대 공제 금액: 5억 2천만 원
    } else if (heir.relationship === 'parent') {
        exemption += 50000000; // 부모 5천만 원
    } else if (heir.relationship === 'sibling') {
        exemption += 50000000; // 형제자매 5천만 원
    } else if (heir.relationship === 'other') {
        exemption += 10000000; // 기타 상속인
    }

    const taxableAmount = Math.max(heirAssetValue - exemption, 0);

    const tax = (() => {
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
    })();

    return {
        name: heir.name,
        share: heir.share,
        assetValue: heirAssetValue,
        exemption,
        taxableAmount,
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
`; // <-- innerHTML 닫힘
  });
});
