document.addEventListener('DOMContentLoaded', () => {
    const inputPage = document.getElementById('input-page');
    const loadingPage = document.getElementById('loading-page');
    const resultPage = document.getElementById('result-page');
    const posterModal = document.getElementById('poster-modal');

    const birthdateInput = document.getElementById('birthdate');
    const submitBtn = document.getElementById('submit-btn');
    const shareBtn = document.getElementById('share-btn');
    const unlockBtn = document.getElementById('unlock-btn');
    const backBtn = document.getElementById('back-btn');
    const breakFateBtn = document.getElementById('break-fate-btn');
    const downloadPosterBtn = document.getElementById('download-poster');
    const closeModalBtn = document.querySelector('.close-modal');

    const yaoSymbolSpan = document.getElementById('yao-symbol');
    const resultInterpretationP = document.getElementById('result-interpretation');
    const resultCard = resultPage.querySelector('.result-card');
    const posterContainer = document.getElementById('poster-container');

    // 预设的爻像和毒舌解读
    const resultsPool = [
        { symbol: "乾 (Qián)", key: "乾", interpretation: "天行健，大哥你能不能行行好，别老宅着？多走两步能咋地！" },
        { symbol: "坤 (Kūn)", key: "坤", interpretation: "地势坤，就你这拖延症，地球都快转不动了。" },
        { symbol: "坎 (Kǎn)", key: "坎", interpretation: "水曰润下，你这智商也就够给花浇浇水了，还可能浇死。" },
        { symbol: "离 (Lí)", key: "离", interpretation: "火曰炎上，脾气比本事大，说的就是你吧？" },
        { symbol: "震 (Zhèn)", key: "震", interpretation: "雷曰动，行动力？不存在的，除非是抢外卖。" },
        { symbol: "巽 (Xùn)", key: "巽", interpretation: "风曰顺，墙头草都没你倒得快。" },
        { symbol: "艮 (Gèn)", key: "艮", interpretation: "山曰止，万年不动是你的超能力吗？" },
        { symbol: "兑 (Duì)", key: "兑", interpretation: "泽曰悦，除了吃和睡，还有啥能让你开心的？哦对，还有沙雕网友。" }
    ];

    // 当前选中的结果
    let currentResult = null;

    function showPage(pageToShow) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        pageToShow.classList.add('active');
    }

    // 根据生日简单估算爻像类型
    function calculateHexagramFromBirthdate(birthdate) {
        if (!birthdate) return 0;
        
        const date = new Date(birthdate);
        const month = date.getMonth() + 1; // 月份从0开始
        const day = date.getDate();
        
        // 简单算法，根据月份和日期组合计算出索引
        // 真实应用中应该有更合理的算命逻辑
        const combinedValue = month * 31 + day;
        return combinedValue % resultsPool.length;
    }

    // 生成海报的函数
    function generatePoster(hexagramKey, interpretation) {
        // 清空已有内容
        posterContainer.innerHTML = '';
        
        // 创建canvas
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 900;
        posterContainer.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // 绘制背景
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#162447');
        gradient.addColorStop(1, '#1a1a2e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 添加闪光点和线条
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * 2;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 229, 255, ' + Math.random() * 0.5 + ')';
            ctx.fill();
        }
        
        // 绘制标题
        ctx.font = 'bold 48px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#00e5ff';
        ctx.fillText('爻算', canvas.width/2, 100);
        
        // 绘制爻像名称
        ctx.font = 'bold 36px Arial, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('你的爻像：' + hexagramKey, canvas.width/2, 180);
        
        // 绘制装饰分割线
        ctx.beginPath();
        ctx.moveTo(150, 220);
        ctx.lineTo(450, 220);
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制图像区域（占位）
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(150, 250, 300, 250);
        
        // 绘制"占位符"文字（实际实现中应从3D场景捕获图像）
        ctx.font = '24px Arial, sans-serif';
        ctx.fillStyle = '#a0a0c0';
        ctx.fillText('[ 3D爻像 ]', canvas.width/2, 350);
        
        // 绘制解读文本
        ctx.font = 'italic 24px Arial, sans-serif';
        ctx.fillStyle = '#e0e0e0';
        
        // 文本换行处理
        const maxWidth = 450;
        let words = interpretation.split(' ');
        let line = '';
        let y = 550;
        
        // 简单的中文文本换行（每15个字符换行）
        for (let i = 0; i < interpretation.length; i += 15) {
            const textChunk = interpretation.substr(i, 15);
            ctx.fillText(textChunk, canvas.width/2, y);
            y += 40;
        }
        
        // 绘制二维码占位区域
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(250, 650, 100, 100);
        ctx.font = '14px Arial, sans-serif';
        ctx.fillStyle = '#a0a0c0';
        ctx.fillText('扫码测算你的命运', canvas.width/2, 780);
        
        // 添加水印
        ctx.font = '16px Arial, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillText('爻算 · 算你命中注定', canvas.width/2, 850);
        
        return canvas;
    }

    // 下载海报
    function downloadPoster() {
        const canvas = posterContainer.querySelector('canvas');
        if (!canvas) return;
        
        // 创建下载链接
        const link = document.createElement('a');
        link.download = '爻算-你的命运解析.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    submitBtn.addEventListener('click', () => {
        const birthdate = birthdateInput.value;
        if (!birthdate) {
            alert('客官，不给生辰八字我咋算呐？');
            return;
        }
        console.log('Birthdate:', birthdate);

        showPage(loadingPage);

        // 模拟推算耗时
        setTimeout(() => {
            // 根据生日决定结果
            const resultIndex = calculateHexagramFromBirthdate(birthdate);
            currentResult = resultsPool[resultIndex];

            yaoSymbolSpan.textContent = currentResult.symbol;
            resultInterpretationP.textContent = currentResult.interpretation;

            // 显示3D爻像
            if (typeof threeScene !== 'undefined') {
                threeScene.createHexagram(currentResult.key);
            }

            // 显示结果页
            showPage(resultPage);
        }, 2500); // 模拟2.5秒加载时间
    });

    shareBtn.addEventListener('click', () => {
        if (!currentResult) {
            alert('还没有算出结果呢，着什么急！');
            return;
        }
        
        // 生成并显示海报
        generatePoster(currentResult.symbol, currentResult.interpretation);
        posterModal.classList.add('active');
    });

    unlockBtn.addEventListener('click', () => {
        alert('想看更深层的秘密？嘿嘿，钱包准备好了吗？（付费功能开发中...）');
    });

    backBtn.addEventListener('click', () => {
        showPage(inputPage);
    });

    // "破命"按钮事件
    breakFateBtn.addEventListener('click', () => {
        // 调用3D爻像的破命特效
        if (typeof threeScene !== 'undefined' && threeScene.breakFateEffect) {
            threeScene.breakFateEffect();
        }
        
        // 结果卡片发光效果
        resultCard.style.transition = 'box-shadow 0.3s ease-in-out';
        resultCard.style.boxShadow = '0 0 30px 10px rgba(255, 65, 108, 0.8)';
        
        setTimeout(() => {
            resultCard.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.4)';
        }, 500);

        // 延迟生成海报模态框
        setTimeout(() => {
            if (!currentResult) return;
            
            // 给出"破命"后的新解读（对原解读做轻微修改）
            let brokenInterpretation = "【破命版】" + currentResult.interpretation + "...但，掌握自己的命运，做命运的主宰者，你比这强多了！";
            
            // 生成并显示海报
            generatePoster(currentResult.symbol + " [已破]", brokenInterpretation);
            posterModal.classList.add('active');
        }, 1000);
    });

    // 下载海报
    downloadPosterBtn.addEventListener('click', downloadPoster);

    // 关闭海报预览
    closeModalBtn.addEventListener('click', () => {
        posterModal.classList.remove('active');
    });

    // 点击模态框外部区域也可关闭
    posterModal.addEventListener('click', (e) => {
        if (e.target === posterModal) {
            posterModal.classList.remove('active');
        }
    });

    // 设置默认日期为今天
    const today = new Date();
    birthdateInput.valueAsDate = today;
}); 