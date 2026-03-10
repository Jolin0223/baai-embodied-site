import { NextResponse } from 'next/server';

// 新增：解决静态导出冲突
export const dynamic = 'force-static';
export const revalidate = 0;

// 1. 嵌入你的完整 mock 数据
const mockData = {
  "brainVideos": [
    {
      "category": "时空推理",
      "videoUrl": "https://baai-solution.ks3-cn-beijing.ksyuncs.com/ei2/video/banner3abc.mp4",
      "cover": "https://aigc-material.xdf.cn/lingguang-aigc/material/chenjialing12/mcthZWdH-2600008999-AigcImage-44c3374110494baea0fe6d00e30513c1_0.png",
      "title": "完成长时间食物制作任务拆解"
    },
    {
      "category": "时空推理",
      "videoUrl": "https://baai-solution.ks3-cn-beijing.ksyuncs.com/ei2/video/banner3abc.mp4",
      "cover": "https://aigc-material.xdf.cn/lingguang-aigc/material/chenjialing12/gjxsR1LN-2600008999-AigcImage-fb2d7d27474f4505a1993f93db680754_0.png",
      "title": "3D感知环境深度实现连续浇花"
    },
    {
      "category": "时空推理",
      "videoUrl": "https://baai-solution.ks3-cn-beijing.ksyuncs.com/ei2/video/banner3abc.mp4",
      "cover": "https://aigc-material.xdf.cn/lingguang-aigc/material/chenjialing12/bkpML25t-2600008999-AigcImage-afc9b53a256f4b99901f00a4265f3267_0.png",
      "title": "多摄像头评估动作奖励赋能强化学习"
    },
    {
      "category": "具身交互",
      "videoUrl": "https://baai-solution.ks3-cn-beijing.ksyuncs.com/ei2/video/banner3abc.mp4",
      "cover": "https://aigc-material.xdf.cn/lingguang-aigc/material/chenjialing12/n4OBkkZN-2600008999-AigcImage-e50e5eba5bd34404bdeab8b2ba0d10f2_0.png",
      "title": "多轮对话打断与记忆执行"
    }
  ],
  "cerebellumVideos": [
    {
      "category": "末端操作",
      "videoUrl": "https://baai-solution.ks3-cn-beijing.ksyuncs.com/ei2/video/banner3abc.mp4",
      "cover": "https://aigc-material.xdf.cn/lingguang-aigc/material/chenjialing12/HvLwahtD-2600008999-AigcImage-384ca94ea2f44ac79e9a398cffea3f19_0.png",
      "title": "灵巧手抓取细小螺丝"
    },
    {
      "category": "移动操作",
      "videoUrl": "https://baai-solution.ks3-cn-beijing.ksyuncs.com/ei2/video/banner3abc.mp4",
      "cover": "https://aigc-material.xdf.cn/lingguang-aigc/material/chenjialing12/RmYeeK25-2600008999-AigcImage-352c7c8c2e3542d4b9ac92418c5fd99a_0.png",
      "title": "轮式机器人在障碍物间平滑移动"
    },
    {
      "category": "视觉导航",
      "videoUrl": "https://baai-solution.ks3-cn-beijing.ksyuncs.com/ei2/video/banner3abc.mp4",
      "cover": "https://aigc-material.xdf.cn/lingguang-aigc/material/chenjialing12/6LndtXGR-2600008999-AigcImage-639f261b8d9c49e7b28d9ac32422b5c4_0.png",
      "title": "无图环境下的动态避障导航"
    },
    {
      "category": "全身控制",
      "videoUrl": "https://baai-solution.ks3-cn-beijing.ksyuncs.com/ei2/video/banner3abc.mp4",
      "cover": "https://aigc-material.xdf.cn/lingguang-aigc/material/chenjialing12/6xI0MQwT-2600008999-AigcImage-c71dad991c534b7eac534af94147eb8a_0.png",
      "title": "双足机器人复杂地形平衡控制"
    }
  ],
  "cases": [
    {
      "logo": "乐聚机器人",
      "photo": "https://aigc-material.xdf.cn/lingguang-aigc/material/chenjialing12/2wJV4sXH-2600008999-AigcImage-c50d0e96b9a04170bf5c62ee43e0d395_0.png",
      "keyword": "导览导购",
      "description": "智源研究院携手乐聚机器人，落地导览导购场景的...",
      "link": "#"
    },
    {
      "logo": "中国联通",
      "photo": "https://aigc-material.xdf.cn/lingguang-aigc/material/chenjialing12/YDc3a2ns-2600008999-AigcImage-fc6e566973a24863810406701551b270_0.png",
      "keyword": "机房巡检",
      "description": "智源研究院携手中国联通，落地数据中心机房智能巡检...",
      "link": "#"
    },
    {
      "logo": "星海图",
      "photo": "https://aigc-material.xdf.cn/lingguang-aigc/material/chenjialing12/PpzI1vVH-2600008999-AigcImage-d0fb5a8dced14717b84e1cfaf4755cbd_0.png",
      "keyword": "工业分拣",
      "description": "智源研究院携手星海图，落地复杂工业件高精度分拣...",
      "link": "#"
    }
  ],
  "openSource": [
    {
      "category": "具身模型",
      "items": [
        {
          "title": "RoboBrainV2.0 Pro",
          "desc": "A Unified Brain Model for Robotic Manipulation from Abstract to Concrete",
          "cover": "/placeholders/os-robobrain.png",
          "techReport": "#",
          "experience": "API调用",
          "history": [
            "RoboBrainV2.0 7B",
            "RoboBrainV1.0"
          ]
        },
        {
          "title": "RoboBrain Audio",
          "desc": "A Unified Brain Model for Robotic Manipulation from Abstract to Concrete",
          "cover": "/placeholders/os-audio.png",
          "techReport": "#",
          "experience": "其他",
          "apply": "#",
          "history": []
        },
        {
          "title": "BAAI Thor",
          "desc": "A Unified Brain Model for Robotic Manipulation from Abstract to Concrete",
          "cover": "/placeholders/os-thor.png",
          "techReport": "#",
          "experience": "样例",
          "history": []
        }
      ]
    },
    {
      "category": "一体化平台",
      "items": [
        {
          "title": "RoboOSV2.0",
          "desc": "A Unified Brain Model for Robotic Manipulation from Abstract to Concrete",
          "cover": "/placeholders/os-roboos.png",
          "techReport": "#",
          "history": [
            "RoboOSV1.0"
          ]
        }
      ]
    }
  ],
  "research": [
    {
      "category": "具身模型",
      "subCategory": "感知推理规划",
      "items": [
        {
          "title": "AutoAgents: A Framework for Automatic Agent Generati",
          "link": "#"
        },
        {
          "title": "EVA: An Embodied World Model for Future Video Anticipation",
          "link": "#"
        },
        {
          "title": "Egocentric Vision Language Planning",
          "link": "#"
        }
      ]
    },
    {
      "category": "具身模型",
      "subCategory": "具身多模交互",
      "items": [
        {
          "title": "EmpathyRobot: A Dataset and Benchmark for Empathetic Task Planning",
          "link": "#"
        }
      ]
    }
  ],
  "history": [
    {
      "time": "2025年10月",
      "content": "正式发布 Emu3.5 多模态世界大模型基座，在图像生成、视觉指导、世界探索、具身操控多项指标上达到 SOTA"
    },
    {
      "time": "2025年9月",
      "content": "发布并开源 RoboBrain-X0（首个零样本跨本体泛化具身小脑模型），发布并开源 RoboBrain-Audio（首个原生全双工语音对话大模型）"
    },
    {
      "time": "2025年6月",
      "content": "正式发布 “悟界” 系列大模型，发布并开源全球最强 7B 具身大脑 RoboBrain 2.0，首个支持 MCP的具身智能大小脑协同框架 RoboOS 2.0"
    },
    {
      "time": "2025年3月",
      "content": "发布并开源全球首个跨本体具身大小脑协作框架 RoboOS 1.0，发布并开源具身多模态大脑模型 RoboBrain 1.0"
    },
    {
      "time": "2024年10月",
      "content": "正式发布 Emu3，验证了基于自回归架构多模态大一统技术路线"
    },
    {
      "time": "2021年3月",
      "content": "智源研究院发布“悟道1.0”，这是我国首个超大规模智能模型系统"
    },
    {
      "time": "2018年11月",
      "content": "北京智源人工智能研究院成立"
    }
  ],
  "news": [
    {
      "cover": "https://www.baai.ac.cn/Upfile/EditPage/20260206/628bf692-2aa8-4241-bb59-097b35d16df1.webp",
      "agency": "机器之心",
      "date": "20250615",
      "snippet": "悟界大模型发布，打通数字与物理世界...",
      "link": "https://www.baai.ac.cn/zh-cn/news-article?formid=562"
    },
    {
      "cover": "https://www.baai.ac.cn/Upfile/EditPage/20260206/628bf692-2aa8-4241-bb59-097b35d16df1.webp",
      "agency": "环球日报",
      "date": "20250729",
      "snippet": "智源研究院开源全球最强具身大脑模型...",
      "link": "https://www.baai.ac.cn/zh-cn/news-article?formid=562"
    },
    {
      "cover": "https://www.baai.ac.cn/Upfile/EditPage/20260206/628bf692-2aa8-4241-bb59-097b35d16df1.webp",
      "agency": "36氪",
      "date": "20250310",
      "snippet": "RoboOS 1.0开源，具身智能迎来安卓时刻...",
      "link": "https://www.baai.ac.cn/zh-cn/news-article?formid=562"
    }
  ],
  "jobs": [
    {
      "title": "具身产品经理",
      "type": "实习",
      "location": "北京",
      "link": "#"
    },
    {
      "title": "VLA算法工程师",
      "type": "实习",
      "location": "北京",
      "link": "#"
    },
    {
      "title": "高级具身智能研究员",
      "type": "正式",
      "location": "北京",
      "link": "#"
    },
    {
      "title": "前端开发工程师（3D/WebGL）",
      "type": "正式",
      "location": "北京",
      "link": "#"
    },
    {
      "title": "机器人控制算法工程师",
      "type": "正式",
      "location": "北京",
      "link": "#"
    }
  ]
};

// 2. 声明使用 Edge 运行时
export const runtime = 'edge';

// 3. 内存存储数据
let storedData = mockData;

// 4. GET 请求
export async function GET() {
  try {
    return NextResponse.json(storedData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

// 5. POST 请求
export async function POST(request: Request) {
  try {
    const newData = await request.json();
    storedData = { ...storedData, ...newData };
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
