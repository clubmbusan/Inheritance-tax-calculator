document.addEventListener('DOMContentLoaded', () => {
    const inheritanceType = document.getElementById('inheritanceType');
    const personalSection = document.getElementById('personalSection');
    const groupSection = document.getElementById('groupSection');
    const addAssetButton = document.getElementById('addAssetButton');
    const assetContainer = document.getElementById('assetContainer');
    const addHeirButton = document.getElementById('addHeirButton');
    const heirContainer = document.getElementById('heirContainer');
    const calculateButton = document.getElementById('calculateButton');
    const result = document.getElementById('result');

    // DOM 요소 확인
    if (!calculateButton || !inheritanceType || !result) {
        console.error('필요한 DOM 요소가 없습니다. HTML을 확인하세요.');
        return;
    }

    // 초기화: 모든 .assetValue 필드에 콤마 이벤트 등록
    document.querySelectorAll('.assetValue').forEach(addCommaFormatting);

    // 초기 주식 입력 필드에 콤마 이벤트 등록 (중요: 항상 초기화 시 필요)
    const initialStockPriceField = document.querySelector('.stockPriceField');
    if (initialStockPriceField) {
        addCommaFormatting(initialStockPriceField); // 초기 필드 이벤트 등록
    }

    // 초기화: 모든 .assetType 필드에 이벤트 등록
    document.querySelectorAll('.assetType').forEach(select => {
        select.addEventListener('change', () => handleAssetTypeChange(select));
    });

    // 숫자에 콤마를 추가하는 함수
    function formatNumberWithCommas(value) {
        return parseInt(value.replace(/[^0-9]/g, '') || '0', 10).toLocaleString();
    }

    // 입력 필드에 콤마 추가 이벤트 등록
    function addCommaFormatting(inputField) {
        inputField.addEventListener('input', () => {
            const numericValue = inputField.value.replace(/,/g, '');
            if (!isNaN(numericValue)) {
                inputField.value = formatNumberWithCommas(numericValue);
            }
        });
    }

    // 재산 유형에 따라 필드를 동적으로 표시
    function handleAssetTypeChange(assetTypeSelect) {
        const assetFields = assetTypeSelect.closest('.asset-entry').querySelector('.assetFields');
        const cashField = assetFields.querySelector('.cashField');
        const realEstateField = assetFields.querySelector('.realEstateField');
        const stockQuantityField = assetFields.querySelector('.stockQuantityField');
        const stockPriceField = assetFields.querySelector('.stockPriceField');
        const stockTotalField = assetFields.querySelector('.stockTotalField');
        const othersField = assetFields.querySelector('.othersField');

        // 모든 필드 숨기기
        cashField.style.display = 'none';
        realEstateField.style.display = 'none';
        stockQuantityField.style.display = 'none';
        stockPriceField.style.display = 'none';
        stockTotalField.style.display = 'none';
        othersField.style.display = 'none';

        // 선택된 유형에 따라 표시
        switch (assetTypeSelect.value) {
            case 'cash':
                cashField.style.display = 'block';
                break;
            case 'realEstate':
                realEstateField.style.display = 'block';
                break;
            case 'stock':
                stockQuantityField.style.display = 'block';
                stockPriceField.style.display = 'block';
                stockTotalField.style.display = 'block';
                break;
            case 'others':
                othersField.style.display = 'block';
                break;
        }
    }

    // 재산 항목 생성
    function createAssetEntry() {
        const newAsset = document.createElement('div');
        newAsset.className = 'asset-entry';
        newAsset.innerHTML = `
            <label>재산 유형:</label>
            <select class="assetType">
                <option value="cash">현금</option>
                <option value="realEstate">부동산</option>
                <option value="stock">주식</option>
                <option value="others">기타</option>
            </select>
            <div class="assetFields">
                <input type="text" class="cashField assetValue" placeholder="금액 (원)" style="display: block;">
                <input type="text" class="realEstateField assetValue" placeholder="평가액 (원)" style="display: none;">
                <input type="number" class="stockQuantityField" placeholder="주식 수량" style="display: none;">
                <input type="text" class="stockPriceField" placeholder="주당 가격 (원)" style="display: none;">
                <input type="text" class="stockTotalField assetValue" placeholder="금액 (원)" style="display: none;" readonly>
                <input type="text" class="othersField assetValue" placeholder="금액 (원)" style="display: none;">
            </div>
        `;
        assetContainer.appendChild(newAsset);

        const assetTypeSelect = newAsset.querySelector('.assetType');
        assetTypeSelect.addEventListener('change', () => handleAssetTypeChange(assetTypeSelect));

        // 콤마 이벤트 등록
        addCommaFormatting(newAsset.querySelector('.cashField'));
        addCommaFormatting(newAsset.querySelector('.realEstateField'));
        addCommaFormatting(newAsset.querySelector('.stockPriceField'));
        addCommaFormatting(newAsset.querySelector('.othersField'));

        // 주식 계산 로직
        const stockQuantityField = newAsset.querySelector('.stockQuantityField');
        const stockPriceField = newAsset.querySelector('.stockPriceField');
        const stockTotalField = newAsset.querySelector('.stockTotalField');
        stockQuantityField.addEventListener('input', updateStockTotal);
        stockPriceField.addEventListener('input', updateStockTotal);

        function updateStockTotal() {
            const quantity = parseInt(stockQuantityField.value || '0', 10);
            const price = parseInt(stockPriceField.value.replace(/,/g, '') || '0', 10);
            stockTotalField.value = formatNumberWithCommas((quantity * price).toString());
        }
    }

        // 재산 추가 버튼 이벤트
    addAssetButton.addEventListener('click', createAssetEntry);

    // 상속인 항목 생성
    addHeirButton.addEventListener('click', () => {
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

    // 모드 전환 이벤트
    inheritanceType.addEventListener('change', () => {
        if (inheritanceType.value === 'personal') {
            personalSection.style.display = 'block';
            groupSection.style.display = 'none';
        } else {
            personalSection.style.display = 'none';
            groupSection.style.display = 'block';
        }
    });

       // 계산 버튼 이벤트
    calculateButton.addEventListener('click', () => {
        const totalAssetValue = Array.from(document.querySelectorAll('.assetValue')).reduce((sum, field) => {
            const value = parseInt(field.value.replace(/,/g, '') || '0', 10);
            return sum + value;
        }, 0);

        if (inheritanceType.value === 'personal') {
            calculatePersonalMode(totalAssetValue);
        } else {
            calculateGroupMode(totalAssetValue);
        }
    });

    // 개인 모드 계산 함수
    function calculatePersonalMode(totalAssetValue) {
        const relationship = document.getElementById('relationshipPersonal');
        if (!relationship) {
            console.error('관계 선택 요소가 없습니다.');
            return;
        }

        const relationshipValue = relationship.value;
        let exemption = 500000000; // 기본 공제

        // 관계에 따른 공제 계산
        if (relationshipValue === 'spouse') {
            exemption += 3000000000; // 배우자 공제
        } else if (relationshipValue === 'adultChild') {
            exemption += 50000000; // 성년 자녀 공제
        } else if (relationshipValue === 'minorChild') {
            const age = parseInt(document.getElementById('childAge').value || '0', 10); // 미성년 자녀 나이
            exemption += Math.max(20 - age, 0) * 20000000; // 미성년 자녀 추가 공제
        } else {
            exemption += 10000000; // 기타 공제
        }

        const taxableAmount = Math.max(totalAssetValue - exemption, 0); // 과세 금액 계산
        const tax = calculateTax(taxableAmount); // 상속세 계산

        // 결과 표시
        result.innerHTML = `
            <h3>계산 결과 (개인 모드)</h3>
            <p>총 재산 금액: ${formatNumberWithCommas(totalAssetValue.toString())} 원</p>
            <p>공제 금액: ${formatNumberWithCommas(exemption.toString())} 원</p>
            <p>과세 금액: ${formatNumberWithCommas(taxableAmount.toString())} 원</p>
            <p>상속세: ${formatNumberWithCommas(tax.toString())} 원</p>
        `;
    }

    // 전체 모드 계산 함수
    function calculateGroupMode(totalAssetValue) {
        const heirs = Array.from(document.querySelectorAll('.heir-entry')).map(heir => {
            const name = heir.querySelector('input[type="text"]').value;
            const relationship = heir.querySelector('select').value;
            const share = parseFloat(heir.querySelector('input[type="number"]').value) || 0;
            const heirAssetValue = (totalAssetValue * share) / 100;

            let exemption = 500000000; // 기본 공제
            if (relationship === 'spouse') {
                exemption += 3000000000; // 배우자 공제
            } else if (relationship === 'adultChild') {
                exemption += 50000000; // 성년 자녀 공제
            } else if (relationship === 'minorChild') {
                const age = parseInt(heir.querySelector('.childAge').value || '0', 10); // 미성년 자녀 나이
                exemption += Math.max(20 - age, 0) * 20000000; // 미성년 자녀 추가 공제
            } else {
                exemption += 10000000; // 기타 공제
            }

            const taxableAmount = Math.max(heirAssetValue - exemption, 0); // 과세 금액 계산
            const tax = calculateTax(taxableAmount); // 상속세 계산

            return { name, share, assetValue: heirAssetValue, exemption, taxableAmount, tax };
        });

        // 결과 표시
        result.innerHTML = `
            <h3>계산 결과 (전체 모드)</h3>
            ${heirs.map(heir => `
                <p>
                    <strong>${heir.name}</strong>: ${formatNumberWithCommas(heir.assetValue.toString())} 원<br>
                    공제 금액: ${formatNumberWithCommas(heir.exemption.toString())} 원<br>
                    과세 금액: ${formatNumberWithCommas(heir.taxableAmount.toString())} 원<br>
                    상속세: ${formatNumberWithCommas(heir.tax.toString())} 원
                </p>
            `).join('')}
        `;
    }

    // 상속세 계산 함수 (누진 공제 반영)
    function calculateTax(taxableAmount) {
        const taxBrackets = [
            { limit: 100000000, rate: 0.1, deduction: 0 },
            { limit: 500000000, rate: 0.2, deduction: 10000000 },
            { limit: 1000000000, rate: 0.3, deduction: 60000000 },
            { limit: 3000000000, rate: 0.4, deduction: 160000000 },
            { limit: Infinity, rate: 0.5, deduction: 460000000 }
        ];

        for (const bracket of taxBrackets) {
            if (taxableAmount <= bracket.limit) {
                return Math.max((taxableAmount * bracket.rate) - bracket.deduction, 0);
            }
        }

        return 0;
    }

    // 숫자 포맷 함수
    function formatNumberWithCommas(value) {
        return parseInt(value.replace(/[^0-9]/g, '') || '0', 10).toLocaleString();
    }
});
