document.addEventListener('DOMContentLoaded', () => {
    const inheritanceType = document.getElementById('inheritanceType');
    const personalSection = document.getElementById('personalSection');
    const groupSection = document.getElementById('groupSection');
    const addAssetButton = document.getElementById('addAssetButton');
    const addHeirButton = document.getElementById('addHeirButton'); // 상속인 추가 버튼
    const assetContainer = document.getElementById('assetContainer');
    const heirContainer = document.getElementById('heirContainer'); // 상속인 컨테이너
    const calculateButton = document.getElementById('calculateButton'); // 계산하기 버튼
    const result = document.getElementById('result');

    // 상속 유형에 따른 섹션 표시/숨김
    inheritanceType.addEventListener('change', () => {
        if (inheritanceType.value === 'personal') {
            personalSection.style.display = 'block';
            groupSection.style.display = 'none';
        } else {
            personalSection.style.display = 'none';
            groupSection.style.display = 'block';
        }
    });

    // 숫자 입력 필드에 콤마 추가 함수
    function formatNumberWithCommas(value) {
        const numericValue = value.replace(/[^0-9]/g, ''); // 숫자 외 문자 제거
        return parseInt(numericValue || '0', 10).toLocaleString();
    }

    // 금액 필드 이벤트 리스너 추가 함수
    function addCommaFormatting(inputField) {
        inputField.addEventListener('input', () => {
            const formattedValue = formatNumberWithCommas(inputField.value);
            inputField.value = formattedValue;
        });
    }

    // 재산 유형 선택 시 필드 업데이트 함수
    function updateAssetFields(assetType, container) {
        const cashField = container.querySelector('.cashField');
        const realEstateField = container.querySelector('.realEstateField');
        const stockQuantityField = container.querySelector('.stockQuantityField');
        const stockPriceField = container.querySelector('.stockPriceField');
        const othersField = container.querySelector('.othersField');

        // 모든 필드 숨김
        cashField.style.display = 'none';
        realEstateField.style.display = 'none';
        stockQuantityField.style.display = 'none';
        stockPriceField.style.display = 'none';
        othersField.style.display = 'none';

        // 선택된 유형만 표시
        if (assetType === 'cash') {
            cashField.style.display = 'block';
            addCommaFormatting(cashField); // 콤마 추가
        } else if (assetType === 'realEstate') {
            realEstateField.style.display = 'block';
            addCommaFormatting(realEstateField); // 콤마 추가
        } else if (assetType === 'stock') {
            stockQuantityField.style.display = 'block';
            stockPriceField.style.display = 'block';
            addCommaFormatting(stockPriceField); // 콤마 추가
        } else if (assetType === 'others') {
            othersField.style.display = 'block';
            addCommaFormatting(othersField); // 콤마 추가
        }
    }

    // 재산 추가 버튼 이벤트
    addAssetButton.addEventListener('click', () => {
        const newAsset = document.createElement('div');
        newAsset.className = 'asset-entry';
        newAsset.innerHTML = `
            <label for="assetType">재산 유형:</label>
            <select class="assetType">
                <option value="cash" selected>현금</option>
                <option value="realEstate">부동산</option>
                <option value="stock">주식</option>
                <option value="others">기타</option>
            </select>
            <div class="assetFields">
                <input type="text" class="cashField assetValue" placeholder="금액 (원)" style="display: block;">
                <input type="text" class="realEstateField assetValue" placeholder="평가액 (원)" style="display: none;">
                <input type="number" class="stockQuantityField" placeholder="주식 수량" style="display: none;">
                <input type="text" class="stockPriceField" placeholder="주당 가격 (원)" style="display: none;">
                <input type="text" class="othersField assetValue" placeholder="금액 (원)" style="display: none;">
            </div>
        `;
        assetContainer.appendChild(newAsset);

        // 새로 추가된 재산 유형 드롭다운 이벤트
        const newAssetType = newAsset.querySelector('.assetType');
        newAssetType.addEventListener('change', (event) => {
            updateAssetFields(event.target.value, newAsset);
        });

        // 각 필드에 콤마 추가 이벤트 연결
        const cashField = newAsset.querySelector('.cashField');
        const realEstateField = newAsset.querySelector('.realEstateField');
        const stockPriceField = newAsset.querySelector('.stockPriceField');
        const othersField = newAsset.querySelector('.othersField');

        addCommaFormatting(cashField);
        addCommaFormatting(realEstateField);
        addCommaFormatting(stockPriceField);
        addCommaFormatting(othersField);
    });

    // 초기화: 기존 재산 항목에 필드 변경 이벤트 추가
    assetContainer.addEventListener('change', (event) => {
        if (event.target.classList.contains('assetType')) {
            const assetType = event.target.value;
            const parentContainer = event.target.closest('.asset-entry');
            updateAssetFields(assetType, parentContainer);
        }
    });

    // 계산하기 버튼 이벤트 (기존 계산 로직 추가 가능)
    calculateButton.addEventListener('click', () => {
        console.log('계산 버튼 클릭됨'); // 계산 로직 추가
    });

    // 상속인 추가 버튼 이벤트
    addHeirButton.addEventListener('click', () => {
        const newHeir = document.createElement('div');
        newHeir.className = 'heir-entry';
        newHeir.innerHTML = `
            <input type="text" placeholder="이름">
            <select>
                <option value="spouse">배우자</option>
                <option value="child">자녀</option>
                <option value="other">기타</option>
            </select>
            <input type="number" placeholder="상속 비율 (%)">
        `;
        heirContainer.appendChild(newHeir);
    });
});

    // 계산하기 버튼
    calculateButton.addEventListener('click', () => {
        const assets = Array.from(document.querySelectorAll('.asset-entry')).map(asset => {
            const type = asset.querySelector('.assetType').value;
            const value = parseInt(asset.querySelector('.assetValue').value.replace(/,/g, '') || '0', 10);
            return { type, value };
        });

        const totalAssetValue = assets.reduce((sum, asset) => sum + asset.value, 0);

        if (inheritanceType.value === 'personal') {
             // 개인분 계산
            const relationship = document.getElementById('relationshipPersonal').value;
            let exemption = 500000000;  // 기본 공제
            if (relationship === 'spouse') exemption += 3000000000;
            else if (relationship === 'adultChild') exemption += 50000000;
            else if (relationship === 'minorChild') exemption += 20000000 * 20;
            else if (relationship === 'parent') exemption += 50000000;
            else if (relationship === 'sibling') exemption += 50000000;
            else exemption += 10000000;

            const taxableAmount = Math.max(totalAssetValue - exemption, 0);
            const tax = calculateTax(taxableAmount);

            result.innerHTML = `
                <h3>계산 결과 (개인분)</h3>
               <p>총 재산 금액: ${totalAssetValue.toLocaleString()} 원</p>
               <p>공제 금액: ${exemption.toLocaleString()} 원</p>
               <p>과세 금액: ${taxableAmount.toLocaleString()} 원</p>
               <p>상속세: ${tax.toLocaleString()} 원</p>
`;
} else {
    // 전체분 계산
    const heirs = Array.from(document.querySelectorAll('.heir-entry')).map(heir => {
        const name = heir.querySelector('input[type="text"]').value;
        const relationship = heir.querySelector('select').value;
        const share = parseFloat(heir.querySelector('input[type="number"]').value) || 0;
        return { name, relationship, share };
    });

    const totalShare = heirs.reduce((sum, heir) => sum + heir.share, 0);
    if (totalShare > 100) {
        result.innerHTML = `<p style="color: red;">상속 비율 합계가 100%를 초과할 수 없습니다.</p>`;
        return;
    }

    const heirResults = heirs.map(heir => {
        const heirAssetValue = (totalAssetValue * heir.share) / 100;
        let exemption = 500000000; // 기본 공제
        if (heir.relationship === 'spouse') exemption += 3000000000;
        else if (heir.relationship === 'child') exemption += 50000000;
        else exemption += 10000000;

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

    result.innerHTML = `
        <h3>계산 결과 (전체분)</h3>
        ${heirResults.map(r => `
            <p>
                <strong>${r.name}</strong><br>
                상속 비율: ${r.share}%<br>
                상속받은 금액: ${r.assetValue.toLocaleString()} 원<br>
                공제 금액: ${r.exemption.toLocaleString()} 원<br>
                과세 금액: ${r.taxableAmount.toLocaleString()} 원<br>
                상속세: ${r.tax.toLocaleString()} 원
            </p>
        `).join('')}
    `;
}); // << 빠진 괄호를 여기 추가
   
// 상속세 계산 함수
    function calculateTax(taxableAmount) {
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
    }
});
