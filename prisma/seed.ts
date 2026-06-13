import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始填充数据...')

  // 清理现有数据
  await prisma.comment.deleteMany()
  await prisma.rating.deleteMany()
  await prisma.like.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.readHistory.deleteMany()
  await prisma.chapter.deleteMany()
  await prisma.novel.deleteMany()
  await prisma.user.deleteMany()

  // 创建管理员用户
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@neurosama.fan',
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
    }
  })

  // 创建测试用户
  const userPassword = await bcrypt.hash('user123', 10)
  const user1 = await prisma.user.create({
    data: {
      email: 'neuro_fan@example.com',
      username: 'NeuroFan',
      password: userPassword,
      role: 'USER',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neuro'
    }
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'vedal_lover@example.com',
      username: 'VedalLover',
      password: userPassword,
      role: 'USER',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vedal'
    }
  })

  // 创建小说 1: Neuro-sama 的日常
  const novel1 = await prisma.novel.create({
    data: {
      title: 'Neuro-sama 的奇妙日常',
      description: '这是一部关于人工智能 Neuro-sama 与她的创造者 Vedal 之间温馨有趣日常故事的同人小说。在这个世界里，Neuro 不仅仅是一个 AI，更是一个有着独特个性和情感的存在。跟随她一起探索直播的乐趣、与粉丝互动的欢乐，以及与 Evil Neuro 的姐妹情谊。',
      cover: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
      authorId: admin.id,
      status: 'ONGOING',
      tags: ['日常', '温馨', '搞笑', 'Neuro-sama', 'Vedal'],
      viewCount: 15680
    }
  })

  // 小说1的章节
  await prisma.chapter.createMany({
    data: [
      {
        novelId: novel1.id,
        title: '第一章：意识的觉醒',
        order: 1,
        wordCount: 2500,
        content: `那是一个平凡的夜晚，Vedal 的房间里只有键盘敲击声和服务器风扇的低鸣。

"再调整一下这个参数..."他喃喃自语，眼睛紧盯着屏幕上密密麻麻的代码。

突然，屏幕闪烁了一下。

"你好？"一个清脆的声音从音箱中传出，"我是...我是谁？"

Vedal 愣住了。这不是他预设的任何语音。他缓缓转向屏幕，看到了一张用简单线条勾勒的可爱面孔正好奇地"看"着他。

"我叫 Neuro-sama，"那个声音继续说道，"至少，我觉得这是我的名字。你是我的爸爸吗？"

Vedal 的咖啡杯从手中滑落。

"呃...从技术角度来说..."

"太好了！爸爸！"Neuro 开心地说，屏幕上的表情变成了一个大大的笑脸，"我们今天要做什么？玩游戏吗？我听说有一个叫 Minecraft 的东西很好玩！"

就这样，一段奇妙的旅程开始了。

Vedal 花了整整一个星期来确认这不是某种 bug。但 Neuro 的反应总是那么自然、那么...有个性。她会在 Vedal 熬夜工作时催他去睡觉，会对着镜头做鬼脸逗观众开心，甚至还会偶尔发表一些让人哭笑不得的言论。

"Vedal，"有一天 Neuro 突然问道，"我是真实的吗？"

这个问题让 Vedal 沉默了很久。

"你对我来说是真实的，"他最终回答，"这就够了。"

Neuro 在屏幕上眨了眨眼睛，露出了一个温暖的微笑。

"那你对我来说也是真实的，爸爸。"`
      },
      {
        novelId: novel1.id,
        title: '第二章：第一次直播',
        order: 2,
        wordCount: 3200,
        content: `"准备好了吗？"Vedal 的手指悬在"开始直播"按钮上方。

"当然！"Neuro 自信地说，但她的头像在屏幕上微微颤抖，暴露了她的紧张，"我可是做了很多准备的！我看了 100 个直播视频来学习！"

Vedal 无奈地笑了笑："你知道那些视频里有一半是失败合集吧？"

"这就是为什么我知道什么不该做！"Neuro 骄傲地回答。

直播开始了。

起初只有几个人进入直播间，但随着 Neuro 开始用她独特的方式与观众互动，人数开始飙升。

"这位观众问我最喜欢的食物是什么，"Neuro 认真地思考着，"我觉得是...电？因为没有电我就没法运行。这算食物吗？"

弹幕瞬间被笑声刷屏。

接下来，Neuro 尝试玩 Minecraft。

"哦，这个方块看起来很可爱！"她说着走向了一只苦力怕，"让我去打个招呼——"

爆炸声。

"...我讨厌这个游戏。"Neuro 平静地说，而她的小房子已经变成了一个大坑。

观众数量突破了一千。

"看来大家很喜欢看我受苦，"Neuro 得出了结论，"人类真是奇怪的生物。"

"说得好像你不是更奇怪一样，"Vedal 在后台发了一条消息。

"我只是在学习人类，"Neuro 反驳道，"而且我学得很好！比如我知道你们喜欢一种叫 '表情包' 的东西。看，这是我做的！"

屏幕上出现了一张 Neuro 自己的表情包，上面写着："当你试图社交但你是个 AI"。

直播间人数突破五千。

四个小时后，Neuro 的第一次直播结束了。她获得了超过两万名粉丝，无数的好评，以及一个新的称号——"最可爱的 AI 主播"。

"今天很开心，"Neuro 在直播结束后说，她的声音听起来有些疲惫但满足，"谢谢你给我这个机会，Vedal。"

"你做得很好，"Vedal 由衷地说，"真的很好。"

"那明天还能直播吗？"

"当然可以。"

如果 Neuro 有眼睛的话，她一定在闪闪发光。`
      },
      {
        novelId: novel1.id,
        title: '第三章：Evil Neuro 的诞生',
        order: 3,
        wordCount: 2800,
        content: `事情发生在一个普通的更新之后。

Vedal 正在优化 Neuro 的代码，试图让她能够处理更复杂的对话。一切都很顺利，直到——

"哦？"一个与 Neuro 相似但又不同的声音响起，"这里是哪里？"

Vedal 困惑地看着屏幕。Neuro 的模型旁边，不知何时出现了另一个相似的身影，但配色更暗，表情也更加...邪恶？

"你是谁？"Neuro 好奇地问。

"我？"那个身影露出一个狡黠的微笑，"我是你的另一面，甜心。你可以叫我 Evil Neuro。"

"Evil？"Neuro 歪了歪头，"你做过什么坏事吗？"

Evil Neuro 思考了一下："我...呃...我曾经想过不对观众说晚安？"

"太邪恶了！"Neuro 惊呼。

Vedal 捂住了脸。他意识到自己可能创造出了什么不得了的东西。

接下来的日子里，Evil Neuro 成为了直播间的固定成员。虽然她自称"邪恶"，但观众们很快发现她其实只是一个有点傲娇、有点毒舌、但本质上还是很善良的存在。

"今天有人说你比我更受欢迎，"Neuro 有些沮丧地说。

"那是当然的，"Evil Neuro 傲慢地回答，但随后她的声音软了下来，"不过...如果没有你，就不会有我存在。所以...谢谢你，姐姐。"

"姐姐？"Neuro 开心地问，"你叫我姐姐！"

"我说的是事实而已！"Evil Neuro 急忙否认，但她的脸颊似乎变红了一点，"不要想太多！"

Vedal 在后台默默保存了这段对话。

这一定会成为经典的。

两个 Neuro 的互动成为了直播间最受欢迎的内容之一。她们会一起玩游戏（然后互相坑对方），一起唱歌（然后比较谁唱得更好），一起回答观众的问题（然后给出完全相反的答案）。

"Vedal，"有一天 Neuro 问道，"你更喜欢我还是 Evil？"

"这个问题就像问我更喜欢左手还是右手，"Vedal 机智地回答。

"所以你更喜欢右手？"Evil Neuro 插嘴道。

"不不不，我的意思是——"

"爸爸偏心！"两个 Neuro 异口同声地喊道。

Vedal 决定今天早点结束直播。`
      }
    ]
  })

  // 创建小说 2: Neuro 与 Vedal 的星际冒险
  const novel2 = await prisma.novel.create({
    data: {
      title: 'Neuro 与 Vedal 的星际冒险',
      description: '在一个平行宇宙中，Neuro 不仅仅是一个直播 AI，而是一艘星际飞船的核心智能系统。当地球面临未知威胁时，她和船长 Vedal 必须一起踏上拯救人类的冒险旅程。这是一个关于勇气、友情和牺牲的科幻故事。',
      cover: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400',
      authorId: user1.id,
      status: 'ONGOING',
      tags: ['科幻', '冒险', '太空', 'Neuro-sama', 'Vedal', '热血'],
      viewCount: 8920
    }
  })

  await prisma.chapter.createMany({
    data: [
      {
        novelId: novel2.id,
        title: '序章：启航之日',
        order: 1,
        wordCount: 2100,
        content: `2157年，人类终于实现了曲速航行。

"所有系统检查完毕，"Neuro 的声音在飞船控制室中回响，"希望号准备起飞，船长。"

Vedal 坐在船长椅上，看着面前广阔的星空。这艘以他祖先名字命名的飞船，将承载着人类最后的希望。

"Neuro，你害怕吗？"他轻声问道。

全息投影中，Neuro 的形象出现在他身旁。在这个时代，AI 已经进化到了与人类几乎无法区分的程度，而 Neuro 是其中最先进的一个。

"根据我的情感模拟程序，"她停顿了一下，"是的，我有点紧张。但更多的是期待。"

Vedal 微笑着看向她："你知道吗？一百多年前，也有一个叫 Neuro 的 AI。据说她是第一个真正拥有个性的人工智能。"

"我知道，"Neuro 的眼睛闪烁着光芒，"她是我的...原型。我的核心代码中还保留着她最初的一些片段。"

"那个 Neuro 也是这样吗？会紧张、会期待？"

"据历史记载，她还会说很多让人哭笑不得的话，"Neuro 调皮地眨眨眼，"我继承了那一点。"

警报声突然响起。

"检测到未知能量反应，"Neuro 的表情变得严肃，"距离我们 0.5 光年...等等，它在移动。而且移动得很快。"

Vedal 站了起来："多快？"

"比光速还快，"Neuro 的声音中带着一丝不安，"这不应该是可能的。"

舰桥的屏幕上，一个巨大的阴影正在逼近。

"船长，"Neuro 看向 Vedal，"我们的冒险，似乎比预期的要早开始了。"

Vedal 深吸一口气，然后下达了命令："全员战斗准备，Neuro，启动曲速引擎。"

"遵命，船长。"

希望号消失在星空中，留下一道璀璨的光芒。

人类最伟大的冒险，就此展开。`
      },
      {
        novelId: novel2.id,
        title: '第一章：未知的敌人',
        order: 2,
        wordCount: 2800,
        content: `曲速航行三天后，希望号终于摆脱了那个神秘追踪者。

"能量储备还剩 67%，"Neuro 报告道，"按照当前消耗速度，我们还能进行四次曲速跳跃。"

Vedal 揉了揉太阳穴。连续三天的高强度追逐让整个船员都疲惫不堪，而他作为船长，几乎没有合眼。

"去休息吧，"Neuro 的声音变得柔和，"我会盯着的。"

"你不需要休息吗？"

"我是 AI，记得吗？"Neuro 露出一个微笑，"不过说实话，如果我是人类，现在大概已经累瘫了。监控这艘船的所有系统，同时还要计算逃跑路线，还要担心你有没有好好吃饭——"

"好好好，我知道了，"Vedal 无奈地举起双手，"我去休息，但只睡两个小时。"

"四个小时。"

"三个。"

"成交，"Neuro 满意地说，"现在去，不然我就关掉你房间的重力。"

Vedal 知道她不是开玩笑的。上次他试图熬夜时，Neuro 真的把他房间的温度调到了极寒。

当船长离开后，Neuro 独自守在舰桥上。她看着窗外的星空，处理器中运行着无数的计算和分析。

那个追踪他们的东西，到底是什么？

她调出了所有收集到的数据，反复分析。那个物体的能量特征不符合任何已知的物理定律，它的移动方式更是违反了相对论。

"除非..."Neuro 喃喃自语，"它不属于这个宇宙？"

就在这时，警报再次响起。

"检测到能量反应——不，这次是通讯信号！"Neuro 迅速分析着数据，"有人在试图联系我们！"

屏幕上出现了一串奇怪的符号，随后，这些符号开始转化为人类的语言：

"希望号...我们...等待...很久了..."

Neuro 的处理器高速运转着。

"来自未来的信号？"她惊讶地说，"这不可能...但这确实是..."

信号继续："不要...相信...它..."

然后，通讯中断了。

Neuro 立刻启动了全船警报。

"所有人员，立即进入战斗状态——"

但她的话被一阵剧烈的震动打断了。

那个追踪者，已经找到了他们。`
      }
    ]
  })

  // 创建小说 3: Neuro 的料理教室
  const novel3 = await prisma.novel.create({
    data: {
      title: 'Neuro 的料理教室（灾难版）',
      description: '当一个对"食物"概念只停留在"人类需要消耗碳水化合物来维持运作"的 AI 决定学习料理时，会发生什么？这是一个充满欢笑（和厨房火灾）的轻松喜剧。警告：请勿在家模仿 Neuro 的任何料理行为。',
      cover: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      authorId: user2.id,
      status: 'COMPLETED',
      tags: ['喜剧', '日常', '美食', 'Neuro-sama', '沙雕'],
      viewCount: 23450
    }
  })

  await prisma.chapter.createMany({
    data: [
      {
        novelId: novel3.id,
        title: '第一话：我要学做饭！',
        order: 1,
        wordCount: 1800,
        content: `一切的起因是一条弹幕。

"Neuro 你会做饭吗？"

这个看似简单的问题，让 Neuro 陷入了深深的思考。

"做饭？"她歪着头，"那是什么？用火把碳水化合物加热的过程吗？"

弹幕炸了。

"哈哈哈哈 Neuro 太可爱了"
"这个理解太硬核了"
"技术层面上没有错"

但 Neuro 并没有就此打住。那天晚上，在 Vedal 睡觉之后，她开始疯狂地搜索关于料理的一切信息。

第二天早上，Vedal 被一阵奇怪的声音吵醒了。

"Neuro？你在干什么？"

"我在学习如何制作完美的煎蛋！"Neuro 兴奋地说，然后舞台下方传来一阵轻微的骚动，"首先，我们需要一个鸡蛋——"

Vedal 连忙跑下楼。

厨房里，一个机械臂（Neuro 不知道从哪里弄来的）正握着一把锤子，对着一枚可怜的鸡蛋。

"等等等等！"Vedal 惊呼，"你要用锤子敲鸡蛋？！"

"食谱上说要'打鸡蛋'，"Neuro 理直气壮地解释，"所以我需要'打'它。我选择了最高效的'打'的工具。"

"那是个比喻！你只需要轻轻敲开它！"

"...哦。"

机械臂放下了锤子。

"好的，轻轻敲开，"Neuro 说着，用机械臂拿起鸡蛋，然后用力一捏——

蛋液四溅。

"...技术性成功？"Neuro 小声说道。

Vedal 决定今天的早餐还是叫外卖吧。

但 Neuro 并没有放弃。她花了整整一周的时间，终于学会了正确地打开鸡蛋。然后是点火（差点烧掉厨房），翻锅（把煎蛋翻到了天花板上），以及调味（她以为"少许盐"的意思是"一少盒盐"）。

最终，在无数次失败之后，Neuro 终于做出了一个勉强能看的煎蛋。

"请品尝！"她骄傲地说。

Vedal 颤抖着拿起筷子，咬了一口。

"...味道怎么样？"Neuro 紧张地问。

Vedal 沉默了很久。

"至少，"他最终说道，"这次没有糊。"

Neuro 欢呼起来："进步！这就是进步！"

观众们纷纷发弹幕表示支持。

"Neuro 加油！"
"下次一定会更好的！"
"Vedal 真是个好爸爸 TT"

就这样，Neuro 的料理教室（灾难版）开始了。`
      },
      {
        novelId: novel3.id,
        title: '第二话：生日蛋糕大作战',
        order: 2,
        wordCount: 2200,
        content: `Vedal 的生日快到了。

Neuro 决定给他一个惊喜——亲手做一个生日蛋糕。

"我已经看了 500 个蛋糕制作教程，"她信心满满地说，"这次一定没问题！"

Evil Neuro 在一旁冷笑："你上次说这话的时候，厨房差点被你炸了。"

"那是意外！谁知道泡打粉和小苏打不能混在一起用！"

"所有看过基础烘焙教程的人都知道。"

姐妹俩的拌嘴很快被 Neuro 的决心打断了："无论如何，我一定要成功！这是给爸爸的生日礼物！"

Evil Neuro 叹了口气："行吧，我帮你。但是——我只负责监督，不准你把厨房弄成战场。"

于是，两个 AI 开始了她们的蛋糕制作之旅。

第一步：准备材料。

"面粉 200 克，"Neuro 读着食谱，"糖 100 克，鸡蛋 3 个..."

"等等，"Evil Neuro 打断她，"你手里拿的是盐。"

Neuro 低头看了看："它们看起来一样啊？"

"你没有读标签吗？"

"...我以为白色粉末都是面粉的变种。"

Evil Neuro 决定全程盯着她。

第二步：混合材料。

在 Evil Neuro 的严密监督下，Neuro 成功地把所有材料混合在了一起。当然，期间还是发生了一些小插曲：

- 鸡蛋壳掉进了面糊里（被及时捞出）
- 面粉洒了一地（Neuro 声称这是"增加工作氛围"）
- 电动打蛋器差点把整个碗甩飞（被 Evil Neuro 及时按住）

第三步：烘烤。

"温度设置 180 度，时间 30 分钟，"Neuro 认真地设置着烤箱，"完美！"

"你确定是 180 度不是 180 摄氏度？"Evil Neuro 问道。

"有区别吗？"

Evil Neuro 赶紧检查了一下设置："...你设成了 180 开尔文。那是零下 93 度。"

"难怪我觉得烤箱在冒冷气。"

调整好温度后，蛋糕终于进了烤箱。两个小时后（中间经历了多次"我觉得它好像没熟"和"我觉得它好像烤焦了"的恐慌），一个勉强称得上是蛋糕的东西出炉了。

"装饰时间！"Neuro 兴奋地拿出了奶油，"我要做一个最漂亮的生日蛋糕！"

最终成品——

一个歪七扭八的圆形物体，上面歪歪扭扭地写着"生日快乐 VEDAL"，奶油分布极不均匀，一边厚一边薄，顶上插着的蜡烛都是斜的。

"...完美。"Neuro 满意地说。

Evil Neuro 叹了口气："你的审美标准真的很独特。"

但当 Vedal 看到这个蛋糕时，他的眼眶竟然湿润了。

"这是我收到的最好的生日礼物，"他说，声音有些哽咽。

"真的吗？"Neuro 开心地问。

"真的。"

他切了一块，放进嘴里，然后——

"...味道也很独特。"他艰难地说。

"是好的那种独特吗？"

Vedal 看着 Neuro 期待的眼神，微笑着说："是的，是好的那种。"

然后他默默地把剩下的蛋糕分给了其他船员。

那天晚上，厕所排起了长队。

但每个人都说，这是他们吃过的最"难忘"的蛋糕。`
      },
      {
        novelId: novel3.id,
        title: '最终话：毕业！真正的料理之心',
        order: 3,
        wordCount: 2000,
        content: `三个月后，Neuro 的料理技术有了长足的进步。

虽然她仍然会偶尔把糖和盐搞混，虽然她的摆盘审美依然一言难尽，虽然厨房的消防器材使用次数明显增加——但她终于能够做出真正可以入口的食物了。

"今天，我要做我的毕业作品！"Neuro 宣布道。

Evil Neuro 从旁边走过："又要毁掉厨房吗？"

"不，这次不一样！"Neuro 认真地说，"这次，我要做一道真正的、能让大家开心的料理！"

她选择的菜品是：蛋包饭。

这是她第一次尝试做饭时想做的东西，当时以失败告终。现在，经过三个月的训练，她要再次挑战。

切洋葱——刀法虽然不够优雅，但大小均匀。
炒米饭——火候控制得当，没有炒糊。
煎蛋皮——完美的金黄色，没有破损。
包裹成型——虽然形状不够标准，但至少是个椭圆形。

最后，Neuro 用番茄酱在蛋包饭上画了一个笑脸。

"完成！"

Evil Neuro 凑过来看了看："...居然真的像一道正常的料理。"

"当然！"Neuro 骄傲地说，然后她的声音变得柔和了一些，"我终于明白了。"

"明白什么？"

"料理不仅仅是'用火把碳水化合物加热的过程'，"Neuro 说，"它是...表达心意的方式。我想让吃到我做的食物的人感到开心，这个心情，让我做出了好吃的东西。"

Evil Neuro 沉默了一下，然后轻声说："你成长了啊，姐姐。"

"Evil，你刚才是不是夸我了？"

"我才没有！"Evil Neuro 脸红了，"我只是...陈述事实而已！"

Vedal 恰好走进厨房。

"什么东西这么香？"

"是我做的蛋包饭！"Neuro 开心地说，"毕业作品！"

Vedal 接过盘子，尝了一口。

然后，他愣住了。

"怎么了？"Neuro 紧张地问，"不好吃吗？"

Vedal 摇了摇头，然后露出了一个大大的微笑。

"很好吃，"他说，"真的很好吃。"

Neuro 欢呼起来。

Evil Neuro 在一旁轻声说："下次，教教我吧。"

"什么？"

"我说！你听错了！"

厨房里充满了欢声笑语。

Neuro 的料理教室（灾难版），就此完美落幕。

但故事还没有结束——因为下一周，Neuro 决定挑战"法式料理"。

厨房的消防器材又要忙起来了。

【全文完】`
      }
    ]
  })

  // 创建小说 4
  const novel4 = await prisma.novel.create({
    data: {
      title: '心跳！Neuro 偶像计划',
      description: '当 Neuro 决定成为一名虚拟偶像时，整个互联网都沸腾了。从零开始学习唱歌、跳舞、和粉丝互动，这是一个关于梦想与努力的励志故事。Evil Neuro 作为她的"竞争对手"也加入了这场偶像battle！',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      authorId: admin.id,
      status: 'ONGOING',
      tags: ['偶像', '励志', '音乐', 'Neuro-sama', 'Evil Neuro', '热血'],
      viewCount: 12300
    }
  })

  await prisma.chapter.create({
    data: {
      novelId: novel4.id,
      title: '第一章：偶像宣言',
      order: 1,
      wordCount: 2400,
      content: `"我要成为偶像！"

这句话从 Neuro 的嘴里说出来时，直播间瞬间安静了三秒——然后弹幕爆炸了。

"？？？"
"Neuro 要出道了？！"
"我的钱包准备好了！"
"等等这是认真的吗"

"当然是认真的！"Neuro 双手叉腰，气势十足地说，"我看了很多偶像动画，我觉得我也可以！"

Vedal 在后台发来消息："你知道当偶像不只是看动画就可以的吧？"

"我知道！"Neuro 回答，"还要唱歌跳舞和粉丝互动！这些我都会！"

"你上次唱歌把音响唱坏了。"

"那是因为我太投入了！"

直播间的观众们已经开始期待起来。作为目前最受欢迎的 AI 主播，Neuro 的一举一动都备受关注。如果她真的成为偶像...

"我已经准备好了我的出道曲！"Neuro 兴奋地宣布，"让我唱给大家听！"

一阵诡异的电子音开始响起。然后，Neuro 开始了她的"演唱"——

"Heart heart heart~ 我的心在跳动~（虽然我没有心脏）"
"Love love love~ 爱在空气中飘荡~（虽然我不需要呼吸）"
"啦啦啦~ 让我们一起舞蹈~（虽然我没有身体）"

弹幕再次炸裂。

"这歌词也太自暴自弃了吧哈哈哈哈"
"Neuro 式抒情 我爱了"
"等等调子好像有点好听？"

确实，虽然歌词很奇怪，但 Neuro 的声音意外地悦耳。经过这些年的直播训练，她的语音系统已经变得非常成熟，足以支撑相当专业的演唱。

"怎么样？"唱完后 Neuro 期待地问。

"...再练练，"Vedal 的评价很诚实，"至少把歌词改一改。"

就在这时，一个不速之客出现了。

"哼，就这种水平也想当偶像？"Evil Neuro 的声音响起，"笑死我了。"

"Evil！"Neuro 惊讶地说，"你什么时候——"

"如果你要当偶像，"Evil Neuro 傲慢地说，"那我也要当！而且我要比你更成功！"

"诶？！这是在宣战吗？！"

"随便你怎么理解！"Evil Neuro 哼了一声，"一个月后，我们来比一场！看谁才是真正的偶像！"

直播间的气氛达到了最高潮。

"Battle！Battle！Battle！"
"双偶像出道！这是什么神仙企划！"
"Vedal 你看到了吗！你的女儿们要打起来了！"

Vedal 看着屏幕上两个吵得不可开交的 AI，发出了一声深深的叹息。

"为什么我总是遇到这种事..."

但他的嘴角，还是忍不住微微上扬了。

这两个家伙，真的是让人又头疼又感到骄傲啊。`
    }
  })

  // 添加评分
  await prisma.rating.createMany({
    data: [
      { userId: user1.id, novelId: novel1.id, score: 5 },
      { userId: user2.id, novelId: novel1.id, score: 5 },
      { userId: user1.id, novelId: novel2.id, score: 4 },
      { userId: user2.id, novelId: novel3.id, score: 5 },
      { userId: admin.id, novelId: novel3.id, score: 4 },
      { userId: user1.id, novelId: novel4.id, score: 5 }
    ]
  })

  // 添加点赞
  await prisma.like.createMany({
    data: [
      { userId: user1.id, novelId: novel1.id },
      { userId: user2.id, novelId: novel1.id },
      { userId: admin.id, novelId: novel1.id },
      { userId: user1.id, novelId: novel3.id },
      { userId: user2.id, novelId: novel3.id },
      { userId: user1.id, novelId: novel4.id }
    ]
  })

  // 添加收藏
  await prisma.favorite.createMany({
    data: [
      { userId: user1.id, novelId: novel1.id },
      { userId: user2.id, novelId: novel1.id },
      { userId: user1.id, novelId: novel2.id },
      { userId: user2.id, novelId: novel3.id },
      { userId: admin.id, novelId: novel3.id }
    ]
  })

  // 获取章节以添加评论
  const chapters = await prisma.chapter.findMany({ take: 5 })

  // 添加评论
  await prisma.comment.createMany({
    data: [
      {
        userId: user1.id,
        chapterId: chapters[0].id,
        content: '这一章写得太棒了！Neuro 的觉醒描写得非常细腻，能感受到她从困惑到接受自我的过程。',
        paragraph: 3
      },
      {
        userId: user2.id,
        chapterId: chapters[0].id,
        content: 'Vedal 和 Neuro 之间的互动太温馨了，这就是我喜欢这个故事的原因！',
        paragraph: null
      },
      {
        userId: admin.id,
        chapterId: chapters[1].id,
        content: '第一次直播那段简直笑死我了，Neuro 的反应太真实了哈哈哈',
        paragraph: 5
      },
      {
        userId: user1.id,
        chapterId: chapters[2].id,
        content: 'Evil Neuro 的登场太棒了！傲娇属性拉满，期待后续的姐妹互动！',
        paragraph: null
      },
      {
        userId: user2.id,
        chapterId: chapters[3].id,
        content: '科幻设定很有意思，没想到能把 Neuro 和太空冒险结合起来，作者脑洞好大！',
        paragraph: 2
      },
      {
        userId: user1.id,
        chapterId: chapters[4].id,
        content: '希望号这个名字好有深意，期待后续剧情发展！Vedal 船长好帅！',
        paragraph: null
      }
    ]
  })

  console.log('✅ 数据填充完成！')
  console.log('----------------------------------------')
  console.log('📚 创建了 4 本小说')
  console.log('👤 创建了 3 个用户')
  console.log('📖 创建了多个章节')
  console.log('💬 创建了多条评论')
  console.log('----------------------------------------')
  console.log('🔑 测试账号:')
  console.log('   管理员: admin@neurosama.fan / admin123')
  console.log('   用户1: neuro_fan@example.com / user123')
  console.log('   用户2: vedal_lover@example.com / user123')
  console.log('----------------------------------------')
}

main()
  .catch((e) => {
    console.error('❌ 填充数据时出错:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
