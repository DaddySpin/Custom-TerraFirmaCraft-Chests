let $TFCChestBlock = Java.loadClass('net.dries007.tfc.common.blocks.wood.TFCChestBlock')
let $TFCBlockEntities = Java.loadClass('net.dries007.tfc.common.blockentities.TFCBlockEntities')
let $TFCChestBlockEntity = Java.loadClass('net.dries007.tfc.common.blockentities.TFCChestBlockEntity')
let $ExtendedProperties = Java.loadClass('net.dries007.tfc.common.blocks.ExtendedProperties')
let $ChestBlockItem = Java.loadClass('net.dries007.tfc.common.items.ChestBlockItem')
let $SoundType = Java.loadClass('net.minecraft.world.level.block.SoundType')
let $ChestBlockEntity = Java.loadClass('net.minecraft.world.level.block.entity.ChestBlockEntity')
let $Helpers = Java.loadClass('net.dries007.tfc.util.Helpers')
let $BlockEntityTypeBuilder = Java.loadClass('net.minecraft.world.level.block.entity.BlockEntityType$Builder')
let $ItemProperties = Java.loadClass('net.minecraft.world.item.Item$Properties')

let chests = [
    ["betterend:dragon_tree_chest","dragon_tree"],
    ["betterend:end_lotus_chest","end_lotus"],
    ["betterend:helix_tree_chest","helix_tree"],
    ["betterend:jellyshroom_chest","jellyshroom"],
    ["betterend:lacugrove_chest","lacugrove"],
    ["betterend:lucernia_chest","lucernia"],
    ["betterend:mossy_glowshroom_chest","mossy_glowshroom"],
    ["betterend:pythadendron_chest","pythadendron"],
    ["betterend:tenanea_chest","tenanea"],
    ["betterend:umbrella_tree_chest","umbrella_tree"],
    ["edenring:auritis_chest","auritis"],
    ["edenring:balloon_mushroom_chest","balloon_mushroom"],
    ["edenring:pulse_tree_chest","pulse_tree"],
    ["edenring:brain_tree_chest","brain_tree"],
]

let CHEST_ENTITY

StartupEvents.registry('block_entity_type', event => {
    CHEST_ENTITY = event.createCustom("tfc:chest", () => $BlockEntityTypeBuilder.of(
        (pos, state) => new $TFCChestBlockEntity(pos, state),
        Block.getTypeList().stream().map(blockId => Block.getBlock(blockId)).filter(block => 
           ["net.dries007.tfc.common.blocks.wood.TFCChestBlock"]
           .includes(block.class.name)
        ).toArray()
    ).build(null))
})

StartupEvents.registry('block', event => {
    chests.forEach(([Block_ID, Wood_Type]) => {
        event.createCustom(Block_ID, () => {
            let extendedProps = $ExtendedProperties.of()
                .strength(2.5, 2.5)
                .sound($SoundType.WOOD)
                .blockEntity(CHEST_ENTITY)
                .noOcclusion()
                .clientTicks((level, pos, state, blockEntity) => {
                    $ChestBlockEntity.lidAnimateTick(level, pos, state, blockEntity)
                })
            
            return new $TFCChestBlock(extendedProps, Wood_Type)
        })
    })
})



StartupEvents.registry('item', event => {
    chests.forEach(([Block_ID, Wood_Type]) => {
        let modid = Block_ID.split(":")[0]
        let itemid = Block_ID.split(":")[1]
        JsonIO.write(`kubejs/assets/${modid}/blockstates/${itemid}.json`, 
            {
            "variants": {
                "": {
                "model": `${modid}:block/wood/chest/${itemid}`
                }
            }
            }
        )
        JsonIO.write(`kubejs/assets/${modid}/models/block/wood/chest/${itemid}.json`, 
            {
            "textures": {
                "particle": `tfc:block/wood/planks/${Wood_Type}`
            }
            }
        )
        JsonIO.write(`kubejs/assets/${modid}/models/block/${itemid}.json`, 
            {
            "textures": {
                "particle": `tfc:block/wood/planks/${Wood_Type}`
            }
            }
        )
        JsonIO.write(`kubejs/assets/${modid}/models/item/${itemid}.json`, 
            {
            "parent": "item/chest",
            "textures": {
                "particle": `tfc:block/wood/planks/${Wood_Type}`
            }
            }
        )
        event.createCustom(Block_ID, () => { 
            let texture = $Helpers.identifier(`tfc/textures/entity/chest/normal/${Wood_Type}.png`)
            return new $ChestBlockItem(Block.getBlock(Block_ID), new $ItemProperties(), texture)
        }).tag('alekiships:can_place_in_compartments').tag('firmaciv:chests').tag('c:wooden_chests')
    })
})