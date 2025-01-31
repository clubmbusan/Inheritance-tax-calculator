<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>상속세 계산기</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .section {
            display: none;
        }
        .section.active {
            display: block;
        }
    </style>
</head>
<body>
    <div class="calculator">
        <h1>2025 상속세 계산기</h1>

        <!-- 상속 유형 선택 -->
        <div class="form-group">
            <label for="inheritanceType">상속 유형:</label>
            <select id="inheritanceType" class="form-control">
                <option value="personal" selected>개인 상속</option>
                <option value="group">협의 상속</option>
                <option value="legal">법정 상속</option> 
                <option value="other">특수 상속</option>
                <option value="businessPersonal">가업 상속</option> 
            </select>
        </div>
       
         <!-- ✅ 기타 상속 선택 시 나타나는 재산 유형 선택 -->
        <div id="otherAssetContainer" class="form-group" style="display: none;">
            <label for="otherAssetType">재산 유형:</label>
            <select id="otherAssetType" class="form-control">
                <option value="dwelling">동거 주택</option>
                <option value="farming">농림 재산</option>
                <option value="factory">공장 재산</option>
            </select>
        </div>

        <!-- 기타 상속 유형별 추가 필드 -->
        <div id="dwellingSection" class="section">
            <h2>동거주택 상속</h2>
            <p>동거주택 상속 공제는 10년 이상 동거한 경우 적용됩니다.</p>
        </div>

        <div id="farmingSection" class="section">
            <h2>영농 상속</h2>
            <p>영농 상속 공제는 10년 이상 자경한 경우 적용됩니다..</p>
        </div>

        <div id="factorySection" class="section">
            <h2>공장 상속</h2>
            <p>공장 상속 공제는 10년 이상 운영한 경우 적용됩니다.</p>
        </div>
            
        <!-- 재산 유형 및 금액 -->
        <div id="assetContainer">
            <h2>상속 재산</h2>
            <div class="asset-entry">
                <label for="assetType">재산 유형 : 금융 재산 20% 공제 최대 2억</label>
                <select id="assetType" class="assetType">
                    <option value="cash" selected>현금</option>
                    <option value="realEstate">부동산</option>
                    <option value="stock">주식</option>
                    <option value="others">기타</option>
                </select>
                <div class="assetFields">
                    <!-- 현금 입력 -->
                    <input type="text" id="cashAmount" class="cashField assetValue" placeholder="금액 (원)" style="display: block;">
                    <!-- 부동산 입력 -->
                    <input type="text" id="realEstateValue" class="realEstateField assetValue" placeholder="평가액 (원)" style="display: none;">
                    <!-- 주식 입력 -->
                    <input type="text" id="stockQuantity" class="stockQuantityField" placeholder="주식 수량" style="display: none;">
                    <input type="text" id="stockPrice" class="stockPriceField" placeholder="주당 가격 (원)" style="display: none;">
                    <input type="text" id="stockTotal" class="stockTotalField" placeholder="총 금액 (원)" style="display: none;" readonly>
                    <!-- 기타 입력 -->
                    <input type="text" id="othersValue" class="othersField assetValue" placeholder="기타 금액 (원)" style="display: none;">
                </div>
                <!-- 삭제 버튼 추가 -->
                <button class="removeAssetButton" style="margin-top: 10px;">다시 하기</button>
            </div>
            <button type="button" id="addAssetButton">재산 추가</button>
        </div>       
            
        <!-- 개인 상속 계산 -->
        <div id="personalSection" class="section active">
        <h2>개인 상속 계산</h2>
        <label for="relationshipPersonal">관계:</label>
        <select id="relationshipPersonal">
            <option value="spouse">배우자</option>
            <option value="adultChild">자녀(성년)</option>
            <option value="minorChild">자녀(미성년)</option>
            <option value="parent">부모</option>
            <option value="sibling">형제자매</option>
            <option value="other">기타</option>
        </select>
              
           <!-- 미성년 자녀 선택 시 나이 입력 필드 -->
          <div id="minorChildAgeContainer" style="display: none;">
          <input type="number" id="minorChildAge" placeholder="미성년 자녀 나이 입력"
          style="margin-top: 10px; margin-bottom: 10px; width: 95.5%; padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 5px;">
          </div>                      
       </div>
         <!-- 협의 상속 계산 -->
         <div id="groupSection" class="section">
         <h2>협의 상속 계산</h2>
         <div id="heirContainer">
            <div class="heir-entry">
                <input type="text" placeholder="이름" class="heirName">
                <select class="relationship">
                    <option value="spouse">배우자</option>
                    <option value="adultChild">성년 자녀</option>
                    <option value="minorChild">미성년 자녀</option>
                    <option value="parent">부모</option>
                    <option value="sibling">형제자매</option>
                    <option value="other">기타</option>
                </select>
                <!-- 미성년 자녀 나이 입력 필드 -->
                <input type="number" class="minorChildAgeField" style="display: none;" min="0" max="18" placeholder="나이 입력">
            
                <input type="number" class="sharePercentageField" placeholder="상속 비율(%)">
             </div>
         </div>
         <button type="button" id="addHeirButton">상속인 추가</button>
     </div>

          <!-- 법정 상속 계산 -->
<div id="legalInheritanceSection" class="section">
    <h2>법정 상속 계산</h2>
    <p>법정 상속은 민법에 따른 법정 상속 비율을 자동 적용합니다.</p>

    <div id="legalHeirContainer">
        <div class="heir-entry">
            <input type="text" placeholder="이름" class="heirName">
            <select class="relationship">
                <option value="spouse">배우자</option>
                <option value="adultChild">성년 자녀</option>
                <option value="minorChild">미성년 자녀</option>
                <option value="parent">부모</option>
                <option value="sibling">형제자매</option>
                <option value="other">기타</option>
            </select>
            <!-- 미성년 자녀 나이 입력 필드 -->
            <input type="number" class="minorChildAgeField" style="display: none;" min="0" max="18" placeholder="나이 입력">
            <!-- ✅ 상속 비율 입력란 제거 -->
        </div>
    </div>
    <button type="button" id="addLegalHeirButton">상속인 추가</button>
</div>
        
        <!-- 가업 상속 -->
<div id="businessPersonalSection" class="section">
    <h2>가업 상속</h2> 
     <div class="heir-entry-group">
        <!-- 후계자 유형 -->
         <select id="businessHeirTypePersonal">
            <option value="" disabled selected>후계자 유형 선택</option>
            <option value="adultChild">성년 자녀 후계자</option>
            <option value="minorChild">미성년 자녀 후계자</option>
            <option value="other">기타 후계자</option>
        </select>

         <!-- 가업 경영 기간 선택 -->
        <select id="businessYearsGroup">
            <option value="" disabled selected>경영기간 선택</option>
            <option value="10">10년 이상</option>
            <option value="20">20년 이상</option>
            <option value="30">30년 이상</option>
        </select>
    </div>
</div>      
      
    <!-- ✅ 상속 비용 입력 버튼 (상속세 계산하기 버튼 위에 위치) -->
<button class="btn btn-green" id="openModal">상속비용</button>

<!-- ✅ 모달 배경 오버레이 (배경 클릭 시 닫기) -->
<div id="modalOverlay" class="modal-overlay"></div>

<!-- ✅ 상속 경비 입력 모달 -->
<div id="costModal" class="modal">
    <div class="modal-content">
        <h2>상속 경비 입력</h2>
        
        <label>장례비:</label>
        <input type="text" id="funeralCost" class="inheritanceCostField" placeholder="금액 입력">
        
        <label>법무비용:</label>
        <input type="text" id="legalFees" class="inheritanceCostField" placeholder="금액 입력">
        
        <label>미납 세금:</label>
        <input type="text" id="unpaidTaxes" class="inheritanceCostField" placeholder="금액 입력">
        
        <label>피상속인 채무:</label>
        <input type="text" id="debt" class="inheritanceCostField" placeholder="금액 입력">
                
        <button class="btn btn-save" id="saveCost">저장</button>
        <button class="btn btn-close" id="closeModal">닫기</button>
    </div>
</div>
        
        <!-- 계산 버튼 -->
        <button type="button" id="calculateButton">계산 하기</button>

        <!-- 결과 영역 -->
        <div id="result" class="result-area"></div>

        <!-- 취득세 계산기 -->
        <div id="extraTaxButtons">
            <button type="button" id="acquisitionTaxButton" onclick="window.location.href='https://your-blog-link.com';">취득세 계산기</button>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html> 
