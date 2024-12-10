document.addEventListener('DOMContentLoaded', () => {
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
                <option value="child">자녀</option>
                <option value="other">기타</option>
            </select>
            <input type="number" placeholder="상속 비율 (%)">
        `;
        heirContainer.appendChild(newHeir);
    });

    // 계산하기 버튼 이벤트
    document.getElementById('calculateButton').addEventListener('click', () => {
        const assetValue = parseInt(document.querySelector(`#${assetType.value}Amount`)?.value.replace(/,/g, '') || '0', 10);
        const heirs = Array.from(document.querySelectorAll('.heir-entry')).map(heir => {
            const name = heir.querySelector('input[type="text"]').value;
            const relationship = heir.querySelector('select').value;
            const share = parseFloat(heir.querySelector('input[type="number"]').value) || 0;
            return { name, relationship, share };
        });

        const totalShare = heirs.reduce((sum, heir) => sum + heir.share, 0);
        const result = heirs.map(heir => ({
            name: heir.name,
            tax: (assetValue * heir.share) / 100,
        }));

        document.getElementById('result').innerHTML = `
            <h3>계산 결과</h3>
            ${result.map(r => `<p>${r.name}: ${r.tax.toLocaleString()} 원</p>`).join('')}
        `;
    });
});
