import ProfessionLanding from "@/components/profession/ProfessionLanding";
import { PROFESSION_CONFIGS } from "@/components/profession/professionConfigs";

export default function AttorneysLanding() {
    return <ProfessionLanding cfg={PROFESSION_CONFIGS.attorneys} />;
}
