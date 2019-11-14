"use strict"
import RedBaseObjectContainer from "./base/RedBaseObjectContainer.js";
import RedSphere from "./geometry/RedSphere.js";
import RedBitmapMaterial from "./RedBitmapMaterial.js";

export default class RedMesh extends RedBaseObjectContainer{
	constructor(redGPU,material) {
		super()
		console.log(this)
		this.geometry = new RedSphere(redGPU);
		this.material = material
		this.uniformBuffer =  redGPU.device.createBuffer(this.material.uniformBufferDescripter );

	}
	createPipeline(redGPU){
		const device = redGPU.device;
		const pipeline = device.createRenderPipeline({
			// 레이아웃은 재질이 알고있으니 들고옴
			layout: device.createPipelineLayout({bindGroupLayouts: [this.material.uniformsBindGroupLayout]}),
			// 버텍스와 프레그먼트는 재질에서 들고온다.
			vertexStage: {
				module: this.material.vShaderModule,
				entryPoint: 'main'
			},
			fragmentStage: {
				module: this.material.fShaderModule,
				entryPoint: 'main'
			},
			// 버텍스 상태는 지오메트리가 알고있음으로 들고옴
			vertexState: this.geometry.vertexState,
			// 컬러모드 지정하고
			colorStates: [
				{
					format: redGPU.swapChainFormat,
					alphaBlend: {
						srcFactor: "src-alpha",
						dstFactor: "one-minus-src-alpha",
						operation: "add"
					}
				}
			],
			// 드로잉 방법을 결정함
			primitiveTopology: 'triangle-list',
			depthStencilState: {
				depthWriteEnabled: true,
				depthCompare: "less",
				format: "depth24plus-stencil8",
			},
			/*
			GPUPrimitiveTopology {
				"point-list",
				"line-list",
				"line-strip",
				"triangle-list",
				"triangle-strip"
			};
			 */
		});
		return pipeline
	}

}