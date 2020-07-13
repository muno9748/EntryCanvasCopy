Entry.captureBoardManager = {
    stage: null,
    canvas: null,

    get CANVAS_MAX_WIDTH() {
        const temp = 480;
        return temp;
    },

    get CANVAS_MAX_HEIGHT() {
        const temp = 270;
        return temp;
    },

    set CANVAS_MAX_WIDTH(v) {
        throw new Error('Cannot re-define property \'CANVAS_MAX_WIDTH\'');
    },

    set CANVAS_MAX_HEIGHT(v) {
        throw new Error('Cannot re-define property \'CANVAS_MAX_HEIGHT\'');
    },

    createCanvas(append = false) {
        if(append) {
            if(document.querySelector('#entryCapturedCanvas')) document.querySelector('#entryCapturedCanvas').remove();
            document.querySelector('#entryCanvas').insertAdjacentHTML('afterend', `<canvas id="entryCapturedCanvas" width="${
                this.CANVAS_MAX_WIDTH
            }" height="${
                this.CANVAS_MAX_HEIGHT
            }" class="entryCanvasCapturedWorkspace" style="width: 100%;"></canvas>`);
            this.stage = new createjs.Stage('entryCapturedCanvas');
            this.canvas = document.querySelector('#entryCapturedCanvas');
        } else {
            const template = document.createElement('template');
            template.innerHTML = `<canvas id="entryCapturedCanvas" width="${
                this.CANVAS_MAX_WIDTH
            }" height="${
                this.CANVAS_MAX_HEIGHT
            }" class="entryCanvasCapturedWorkspace" style="width: 100%;"></canvas>`;
            this.canvas = template.content.children[0].cloneNode(true);
            this.stage = new createjs.Stage(this.canvas);
        }
    },

    async captureCanvas() {

        if(!this.canvas) this.createCanvas();
    
        const stage = this.stage || new createjs.Stage('entryCapturedCanvas');
        const bitmapLoader = url => {
            return new Promise(resolve => {
                const image = new Image();
                image.onload = () => resolve(image);
                image.src = url;
            });
        }
        const objects = Entry.container.getCurrentObjects();
    
        for(let i = 0; i < objects.length; i++) {
			let temp;
            const object = objects[i];
            if(object.objectType == 'sprite') {
                const bitmapImage = await bitmapLoader(object.selectedPicture.fileurl || `/uploads/${
                    object.selectedPicture.filename.substr(0, 2)
                }/${
                    object.selectedPicture.filename.substr(2, 2)
                }/image/${
                    object.selectedPicture.filename
                }.${
                    object.selectedPicture.imageType || 'png'
                }`);
                const bitmap = new createjs.Bitmap(bitmapImage);
        
                bitmap.regX = object.entity.regX;
                bitmap.regY = object.entity.regY;
                bitmap.x = (this.CANVAS_MAX_WIDTH / 2) + object.entity.x;
                bitmap.y = (this.CANVAS_MAX_HEIGHT / 2) + object.entity.y * -1;
                bitmap.scaleX = object.entity.scaleX * (object.entity.width / bitmap.image.width);
                bitmap.scaleY = object.entity.scaleY * (object.entity.height / bitmap.image.height);
                bitmap.zIndex = i;
				bitmap.alpha = object.entity.object.alpha;
    
				temp = bitmap;

                stage.addChild(bitmap);
            } else {
                const textGroup = new createjs.Container();
                const text = new createjs.Text(object.text, `${object.entity.fontSize}px ${object.entity.fontType}`, object.entity.colour);
                text.textAlign = object.entity.object.children[1].textAlign;
                text.textBaseline = object.entity.object.children[1].textBaseline;
                const rect = new createjs.Shape();
                rect.graphics.beginFill(object.entity.bgColor).drawRect(0, -(text.getMeasuredHeight() / 2), text.getMeasuredWidth(), text.getMeasuredHeight()).endFill();
                textGroup.addChild(rect, text);
                textGroup.zIndex = i;
                textGroup.x = (this.CANVAS_MAX_WIDTH / 2) + object.entity.x;
                textGroup.y = (this.CANVAS_MAX_HEIGHT / 2) + object.entity.y * -1;
                textGroup.scaleX = object.entity.scaleX;
                textGroup.scaleY = object.entity.scaleY;

				temp = textGroup;

                stage.addChild(textGroup);
            }
			if(object.entity.dialog) {
				const [ width, height ] = [ object.entity.dialog.width, object.entity.dialog.height ];
				const container = new createjs.Container();
				const rect = new createjs.Shape();
				const notch = new createjs.Shape();
				const text = new createjs.Text(object.entity.dialog.message_, "15px NanumGothic", "#000000");
				const padding = 10;
				rect.graphics
                    .beginFill('#ffffff')
                    .setStrokeStyle(2, 'round')
                    .beginStroke('#4f80ff')
                    .drawRoundRect(
                        -10,
                        -10,
                        width + 2 * padding,
                        height + 2 * padding,
                        10
                    );
				switch(object.entity.dialog.notch.type) {
                    case 'ne': {
                        notch.graphics
                            .beginFill('#ffffff')
                            .setStrokeStyle(3, 2)
                            .beginStroke('#ffffff')
                            .moveTo(3, height + padding)
                            .lineTo(11, height + padding)
                            .setStrokeStyle(2, 1, 1)
                            .beginStroke('#4f80ff')
                            .moveTo(2, height + padding)
                            .lineTo(2, height + 9 + padding)
                            .lineTo(12, height + padding);
						break;
					}
                    case 'nw': {
                        notch.graphics
                            .beginFill('#ffffff')
                            .setStrokeStyle(3, 2)
                            .beginStroke('#ffffff')
                            .moveTo(width - 3, height + padding)
                            .lineTo(width - 11, height + padding)
                            .setStrokeStyle(2, 1, 1)
                            .beginStroke('#4f80ff')
                            .moveTo(width - 2, height + padding)
                            .lineTo(width - 2, height + 9 + padding)
                            .lineTo(width - 12, height + padding);
						break;
					}
                    case 'se': {
                        notch.graphics
                            .beginFill('#ffffff')
                            .setStrokeStyle(3, 2)
                            .beginStroke('#ffffff')
                            .moveTo(3, -padding)
                            .lineTo(11, -padding)
                            .setStrokeStyle(2, 1, 1)
                            .beginStroke('#4f80ff')
                            .moveTo(2, -padding)
                            .lineTo(2, -padding - 9)
                            .lineTo(12, -padding);
						break;
					}
                    case 'sw': {
                        notch.graphics
                            .beginFill('#ffffff')
                            .setStrokeStyle(3, 2)
                            .beginStroke('#ffffff')
                            .moveTo(width - 3, -padding)
                            .lineTo(width - 11, -padding)
                            .setStrokeStyle(2, 1, 1)
                            .beginStroke('#4f80ff')
                            .moveTo(width - 2, -padding)
                            .lineTo(width - 2, -padding - 9)
                            .lineTo(width - 12, -padding);
						break;
					}
				}
				container.addChild(rect);
				container.addChild(notch);
				container.addChild(text);
				container.regX = container.getBounds().width / 2;
				container.regY = container.getBounds().height / 2;
				container.x = (temp.x - object.entity.object.x) + object.entity.dialog.object.x;
				container.y = (temp.y - object.entity.object.y) + object.entity.dialog.object.y;
				stage.addChild(container);
			}
			if(object.entity.object.filters.length) {
				const effects = object.entity.effect; 
				object.entity.object.filters.forEach(filter => {
					if(filter instanceof createjs.ColorMatrixFilter) {
						const matrix = filter.matrix.toArray();
						const colorMatrix = new createjs.ColorMatrix();
						matrix.forEach((v, i) => colorMatrix[i] = v);
						const colorMatrixFilter = new createjs.ColorMatrixFilter(colorMatrix);
						if(!temp.filters) temp.filters = [];
						temp.filters.push(colorMatrixFilter)
					}
				})
				temp.cache(0, 0, temp.getBounds().width, temp.getBounds().height);
			}
            stage.sortChildren((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
        }
    
        stage.update();
    
    } 
}
Entry.captureBoardManager.noConflict = ((_captureBoardManager) => {
    return () => {
        delete Entry.captureBoardManager;
        window.captureBoardManager = undefined;
        return _captureBoardManager;
    }
})(Entry.captureBoardManager); 
window.captureBoardManager = Entry.captureBoardManager;
