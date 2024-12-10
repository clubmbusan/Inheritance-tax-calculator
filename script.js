document.addEventListener('DOMContentLoaded', () => {
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
        // 계산 로직 구현...
    });
});
